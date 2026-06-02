function normalizeText(value) {
  return String(value || "").trim()
}

function buildPatternHints(tags = []) {
  const lowerTags = tags.map((tag) => tag.toLowerCase())
  const hints = []

  if (lowerTags.some((tag) => tag.includes("array") || tag.includes("two pointer"))) {
    hints.push("Check whether a left/right pointer sweep can reduce nested loops into one linear pass.")
  }

  if (lowerTags.some((tag) => tag.includes("hash") || tag.includes("map"))) {
    hints.push("Ask whether quick lookup of previously seen values would turn repeated scanning into O(1) access.")
  }

  if (lowerTags.some((tag) => tag.includes("dynamic") || tag.includes("dp"))) {
    hints.push("Define the state carefully first: what exact subproblem lets you build the answer from smaller answers?")
  }

  if (lowerTags.some((tag) => tag.includes("tree") || tag.includes("graph"))) {
    hints.push("Decide early whether traversal order matters more than storage structure: DFS for recursive shape, BFS for shortest layers.")
  }

  if (lowerTags.some((tag) => tag.includes("binary search"))) {
    hints.push("Look for a monotonic condition so you can binary search on the answer or index space.")
  }

  if (lowerTags.some((tag) => tag.includes("stack"))) {
    hints.push("Track what should stay in memory and what must be removed when a newer element invalidates older work.")
  }

  if (lowerTags.some((tag) => tag.includes("string"))) {
    hints.push("Write down exactly what each pointer or index means before manipulating substrings.")
  }

  return hints.slice(0, 3)
}

function buildGuardrails(problem) {
  const guardrails = [
    "Do not jump into coding before naming the input, output, and invariants in one sentence.",
    "Test your idea against the smallest edge case and one awkward edge case before trusting it."
  ]

  if (problem.difficulty === "Hard") {
    guardrails.push("For a hard problem, compare two candidate strategies and estimate time complexity before coding.")
  }

  return guardrails
}

function buildProblemDigest(problem) {
  const examples = Array.isArray(problem.examples) ? problem.examples.slice(0, 2) : []

  return {
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags || [],
    points: problem.points || 0,
    functionName: problem.functionName || "solution",
    description: normalizeText(problem.description).slice(0, 1000),
    pseudocode: normalizeText(problem.pseudocode).slice(0, 800),
    examples: examples.map((example) => ({
      input: normalizeText(example.input),
      output: normalizeText(example.output),
      explanation: normalizeText(example.explanation)
    }))
  }
}

function buildFallbackReply(problem, message) {
  const normalizedMessage = normalizeText(message).toLowerCase()
  const patternHints = buildPatternHints(problem.tags)
  const digest = buildProblemDigest(problem)

  const intro = `Let's reason about "${digest.title}" without jumping to the final code.`
  const plan = [
    `Goal: restate what the function must return for the given input.`,
    `Key signal: ${digest.tags.length > 0 ? digest.tags.slice(0, 3).join(", ") : "focus on the input/output relationship"}.`,
    `Complexity target: start by asking what brute force would cost, then look for one data structure or invariant that removes repeated work.`
  ]

  const edgeCases = [
    "empty or minimal input",
    "duplicate values or repeated characters",
    "already optimal or already sorted structure"
  ]

  const explanation = normalizedMessage.includes("logic") || normalizedMessage.includes("understand") || normalizedMessage.includes("why")
    ? [
        "Think in terms of state transitions: after each step, what information must remain true for the next step to work?",
        digest.examples[0]
          ? `Walk the first example slowly and describe how your tracked state changes from input ${digest.examples[0].input} to output ${digest.examples[0].output}.`
          : "Walk a tiny hand-made example and narrate how each variable changes."
      ]
    : [
        "Start with a plain-English strategy before translating it into syntax.",
        "If your first thought uses nested loops, ask what memory structure could remember useful work from earlier iterations."
      ]

  return {
    mode: "fallback",
    message: [
      intro,
      "",
      "Approach",
      ...plan.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Pattern Radar",
      ...(patternHints.length > 0 ? patternHints.map((item) => `- ${item}`) : ["- Look for a repeatable rule that updates the answer one step at a time."]),
      "",
      "Logic Check",
      ...explanation.map((item) => `- ${item}`),
      "",
      "Before You Code",
      ...buildGuardrails(problem).map((item) => `- ${item}`),
      "",
      "Edge Cases To Test",
      ...edgeCases.map((item) => `- ${item}`)
    ].join("\n")
  }
}

async function getOpenAIReply(problem, messages) {
  const apiKey = process.env.OPENAI_API_KEY
  const apiUrl = process.env.OPENAI_API_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/responses"

  if (!apiKey) {
    return null
  }

  const coachPrompt = [
    "You are SmartCode Coach, an in-editor coding mentor.",
    "You help users solve one coding problem at a time.",
    "Never provide a full solution, full code, or copy-paste-ready final answer.",
    "Do provide: hints, decomposition, data structure suggestions, logic walkthroughs, complexity guidance, and edge cases.",
    "If the user asks for code, refuse politely and redirect to the smallest next step.",
    "Use concise markdown with sections when helpful.",
    `Current problem JSON: ${JSON.stringify(buildProblemDigest(problem))}`
  ].join(" ")

  const input = [
    {
      role: "system",
      content: coachPrompt
    },
    ...messages.map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: normalizeText(entry.content)
    }))
  ]

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input,
        temperature: 0.6,
        max_output_tokens: 500
      })
    })

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    const text = normalizeText(payload.output_text)

    if (!text) {
      return null
    }

    return {
      mode: "openai",
      message: text
    }
  } catch {
    return null
  }
}

async function buildCoachReply(problem, messages) {
  const openAIReply = await getOpenAIReply(problem, messages)

  if (openAIReply) {
    return openAIReply
  }

  const lastUserMessage = [...messages].reverse().find((entry) => entry.role === "user")

  return buildFallbackReply(problem, lastUserMessage?.content || "")
}

module.exports = {
  buildCoachReply
}
