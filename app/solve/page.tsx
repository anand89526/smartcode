"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"
import CodeEditor from "../../components/CodeEditor"
import { motion } from "framer-motion"

export default function Solve() {

  const [output, setOutput] = useState("")

  const runCode = () => {
    setOutput("Code executed successfully 🚀")
  }

  return (
    <div className="bg-[#0d1117] text-white min-h-screen">

      <Navbar />

      <div className="grid grid-cols-2 h-[90vh]">

        {/* LEFT SIDE — Problem */}
        <div className="p-8 border-r border-gray-800">

          <h2 className="text-2xl font-bold text-green-400">
            Two Sum
          </h2>

          <p className="mt-4 text-gray-400">
            Given an array of integers nums and an integer target,
            return indices of the two numbers such that they add up to target.
          </p>

          <div className="mt-6 bg-[#161b22] p-4 rounded-lg">
            <p className="text-gray-300">Example:</p>

            <pre className="text-sm text-gray-400 mt-2">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]`}
            </pre>
          </div>

        </div>

        {/* RIGHT SIDE — Editor */}
        <div className="p-6 flex flex-col">

          <CodeEditor />

          {/* Buttons */}
          <div className="mt-4 flex gap-3">

            <button
              onClick={runCode}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Run Code
            </button>

            <button
              className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
            >
              Submit
            </button>

          </div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 bg-[#161b22] p-4 rounded-lg"
          >
            <h4 className="text-gray-400 mb-2">Output</h4>
            <pre>{output}</pre>
          </motion.div>

        </div>

      </div>

    </div>
  )
}