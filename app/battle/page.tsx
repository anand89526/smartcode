"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"
import CodeEditor from "../../components/CodeEditor"
import { motion } from "framer-motion"

export default function Battle() {

  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(60)

  const startBattle = () => {
    setStarted(true)

    let timer = 60

    const interval = setInterval(() => {
      timer--
      setTime(timer)

      if (timer === 0) clearInterval(interval)
    }, 1000)
  }

  return (
    <div className="bg-[#0d1117] text-white min-h-screen">

      <Navbar />

      {!started ? (

        <div className="flex flex-col items-center justify-center h-[80vh]">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-green-400"
          >
            Battle Arena ⚔️
          </motion.h1>

          <button
            onClick={startBattle}
            className="mt-8 px-8 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
          >
            Join Battle
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-2 h-[90vh]">

          {/* LEFT SIDE */}
          <div className="p-8 border-r border-gray-800">

            <h2 className="text-xl font-bold text-green-400">
              Opponent: Player123
            </h2>

            <p className="mt-2 text-gray-400">
              Time Left: {time}s
            </p>

            <div className="mt-6">

              <h3 className="text-lg font-semibold">
                Problem: Two Sum
              </h3>

              <p className="text-gray-400 mt-2">
                Find two indices such that they add up to target.
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 flex flex-col">

            <CodeEditor />

            <button className="mt-4 px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              Submit Solution
            </button>

          </div>

        </div>

      )}

    </div>
  )
}