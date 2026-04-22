/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs/promises")
const os = require("node:os")
const path = require("node:path")
const vm = require("node:vm")
const { execFile } = require("node:child_process")
const typescript = require("../../node_modules/typescript")

function normalizeValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function stableStringify(value) {
  return JSON.stringify(value)
}

function sortByStableString(array) {
  return [...array].sort((left, right) => stableStringify(left).localeCompare(stableStringify(right)))
}

function normalizeForMode(value, mode = "exact") {
  const normalized = normalizeValue(value)

  if (!Array.isArray(normalized)) {
    return normalized
  }

  if (mode === "unordered_array") {
    return sortByStableString(normalized)
  }

  if (mode === "unordered_nested") {
    return sortByStableString(
      normalized.map((item) => (Array.isArray(item) ? sortByStableString(item) : item))
    )
  }

  return normalized
}

function compareValues(actual, expected, mode = "exact") {
  return stableStringify(normalizeForMode(actual, mode)) === stableStringify(normalizeForMode(expected, mode))
}

function execFileAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject({
          error,
          stdout,
          stderr
        })
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

function getFailureMessage(failure) {
  if (!failure) {
    return "Unknown execution failure."
  }

  if (typeof failure.stderr === "string" && failure.stderr.trim()) {
    return failure.stderr
  }

  if (typeof failure.stdout === "string" && failure.stdout.trim()) {
    return failure.stdout
  }

  if (failure.error?.message) {
    return failure.error.message
  }

  if (failure.message) {
    return failure.message
  }

  return String(failure)
}

function createJavascriptCandidate(problem, code) {
  const context = {
    console: {
      log: () => {}
    }
  }

  vm.createContext(context)

  const bootstrap = new vm.Script(
    `${code}
globalThis.__smartcode_export__ = typeof ${problem.functionName} === "function" ? ${problem.functionName} : undefined;`
  )

  bootstrap.runInContext(context, { timeout: 1000 })

  const candidate = context.__smartcode_export__

  if (typeof candidate !== "function") {
    throw new Error(`Expected a function named "${problem.functionName}".`)
  }

  return candidate
}

function evaluateFunctionAgainstCases(problem, candidate) {
  const compareMode = problem.compareMode || "exact"

  for (let index = 0; index < problem.testCases.length; index += 1) {
    const testCase = problem.testCases[index]

    try {
      const actual = candidate(...testCase.args)
      const expected = testCase.expected

      if (!compareValues(actual, expected, compareMode)) {
        return {
          status: "wrong_answer",
          passed: index,
          total: problem.testCases.length,
          failedCase: index + 1,
          expected: normalizeForMode(expected, compareMode),
          actual: normalizeForMode(actual, compareMode)
        }
      }
    } catch (error) {
      return {
        status: "runtime_error",
        passed: index,
        total: problem.testCases.length,
        error: error.message
      }
    }
  }

  return {
    status: "accepted",
    passed: problem.testCases.length,
    total: problem.testCases.length
  }
}

function evaluateJavascript(problem, code) {
  try {
    const candidate = createJavascriptCandidate(problem, code)
    return evaluateFunctionAgainstCases(problem, candidate)
  } catch (error) {
    return {
      status: "compile_error",
      passed: 0,
      total: problem.testCases.length,
      error: error.message
    }
  }
}

function evaluateTypescript(problem, code) {
  try {
    const transpiled = typescript.transpileModule(code, {
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2020
      }
    }).outputText

    const candidate = createJavascriptCandidate(problem, transpiled)
    return evaluateFunctionAgainstCases(problem, candidate)
  } catch (error) {
    return {
      status: "compile_error",
      passed: 0,
      total: problem.testCases.length,
      error: error.message
    }
  }
}

function toJavaLiteral(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "new int[]{}"
    }

    const firstValue = value[0]

    if (Array.isArray(firstValue)) {
      return `new int[][]{${value.map((item) => toJavaLiteral(item)).join(", ")}}`
    }

    if (typeof firstValue === "string") {
      return `new String[]{${value.map((item) => JSON.stringify(item)).join(", ")}}`
    }

    if (typeof firstValue === "boolean") {
      return `new boolean[]{${value.map((item) => (item ? "true" : "false")).join(", ")}}`
    }

    return `new int[]{${value.join(", ")}}`
  }

  if (typeof value === "string") {
    return JSON.stringify(value)
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }

  return String(value)
}

function parseJavaOutput(rawValue, expected) {
  if (Array.isArray(expected)) {
    try {
      const normalized = rawValue
        .replace(/\[/g, "[")
        .replace(/\]/g, "]")
        .replace(/,\s*/g, ",")
      return JSON.parse(normalized.replace(/([A-Za-z_][A-Za-z0-9_]*)/g, "\"$1\""))
    } catch {
      return rawValue
    }
  }

  if (typeof expected === "number") {
    return Number(rawValue)
  }

  if (typeof expected === "boolean") {
    return rawValue === "true"
  }

  return rawValue
}

async function evaluateJava(problem, code) {
  const compareMode = problem.compareMode || "exact"
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "smartcode-java-"))

  try {
    const solutionPath = path.join(workspace, "Solution.java")
    const runnerPath = path.join(workspace, "SmartCodeRunner.java")

    const runnerSource = `
import java.util.Arrays;

public class SmartCodeRunner {
  private static String toJson(Object value) {
    if (value == null) {
      return "null";
    }
    if (value instanceof Object[]) {
      return Arrays.deepToString((Object[]) value).replace(" ", "");
    }
    if (value instanceof int[]) {
      return Arrays.toString((int[]) value).replace(" ", "");
    }
    if (value instanceof int[][]) {
      return Arrays.deepToString((int[][]) value).replace(" ", "");
    }
    if (value instanceof boolean[]) {
      return Arrays.toString((boolean[]) value).replace(" ", "");
    }
    if (value instanceof boolean[][]) {
      return Arrays.deepToString((boolean[][]) value).replace(" ", "");
    }
    if (value instanceof String[]) {
      return Arrays.toString((String[]) value).replace(" ", "");
    }
    if (value instanceof String[][]) {
      return Arrays.deepToString((String[][]) value).replace(" ", "");
    }
    return String.valueOf(value).replace(" ", "");
  }

  public static void main(String[] args) {
    try {
      switch (args[0]) {
${problem.testCases
  .map((testCase, index) => {
    const invocation = `Solution.${problem.functionName}(${testCase.args.map((argument) => toJavaLiteral(argument)).join(", ")})`
    return `        case "${index}":
          System.out.print(toJson(${invocation}));
          break;`
  })
  .join("\n")}
        default:
          throw new IllegalArgumentException("Unknown test case");
      }
    } catch (Throwable error) {
      System.err.print(error.getMessage() == null ? error.toString() : error.getMessage());
      System.exit(1);
    }
  }
}
`

    await Promise.all([
      fs.writeFile(solutionPath, code, "utf8"),
      fs.writeFile(runnerPath, runnerSource, "utf8")
    ])

    const javaCompileCommand = process.platform === "win32" ? "cmd" : "javac"
    const javaCompileArgs =
      process.platform === "win32"
        ? ["/c", "javac", "Solution.java", "SmartCodeRunner.java"]
        : ["Solution.java", "SmartCodeRunner.java"]

    await execFileAsync(javaCompileCommand, javaCompileArgs, {
      cwd: workspace,
      timeout: 4000
    })

    for (let index = 0; index < problem.testCases.length; index += 1) {
      const testCase = problem.testCases[index]

      try {
        const javaRunCommand = process.platform === "win32" ? "cmd" : "java"
        const javaRunArgs =
          process.platform === "win32"
            ? ["/c", "java", "-cp", workspace, "SmartCodeRunner", String(index)]
            : ["-cp", workspace, "SmartCodeRunner", String(index)]

        const { stdout } = await execFileAsync(javaRunCommand, javaRunArgs, {
          cwd: workspace,
          timeout: 4000
        })

        const normalizedActual = parseJavaOutput(stdout.trim(), testCase.expected)

        if (!compareValues(normalizedActual, testCase.expected, compareMode)) {
          return {
            status: "wrong_answer",
            passed: index,
            total: problem.testCases.length,
            failedCase: index + 1,
            expected: normalizeForMode(testCase.expected, compareMode),
            actual: normalizeForMode(normalizedActual, compareMode)
          }
        }
      } catch (executionFailure) {
        return {
          status: "runtime_error",
          passed: index,
          total: problem.testCases.length,
          error: getFailureMessage(executionFailure)
        }
      }
    }

    return {
      status: "accepted",
      passed: problem.testCases.length,
      total: problem.testCases.length
    }
  } catch (compilationFailure) {
    return {
      status: "compile_error",
      passed: 0,
      total: problem.testCases.length,
      error: getFailureMessage(compilationFailure)
    }
  } finally {
    await fs.rm(workspace, { recursive: true, force: true })
  }
}

async function evaluateSubmission(problem, code, language) {
  if (language === "javascript") {
    return evaluateJavascript(problem, code)
  }

  if (language === "typescript") {
    return evaluateTypescript(problem, code)
  }

  if (language === "java") {
    return evaluateJava(problem, code)
  }

  return {
    status: "compile_error",
    passed: 0,
    total: problem.testCases.length,
    error: `Runtime for "${language}" is not installed on this machine yet.`
  }
}

module.exports = {
  evaluateSubmission
}
