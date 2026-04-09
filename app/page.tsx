"use client"

import Navbar from "../components/Navbar"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter()

  return (
    <div className="bg-[#0d1117] text-white min-h-screen">

      <Navbar />

      {/* HERO SECTION */}
      <div className="grid grid-cols-2 items-center px-16 py-20">

        {/* LEFT SIDE */}
        <div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold leading-tight"
          >
            Transform Your Coding Journey 🚀
          </motion.h1>

          <p className="text-gray-400 mt-6 text-lg">
            SmartCode is an AI-powered coding platform where you can solve problems,
            compete in real-time battles, and improve your DSA skills with structured learning.
          </p>

          <div className="mt-8 flex gap-4">

            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              Start Coding
            </button>

            <button className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
              Explore Problems
            </button>

          </div>

          {/* STATS */}
          <div className="flex gap-10 mt-12 text-center">

            <div>
              <p className="text-2xl font-bold text-green-400">150+</p>
              <p className="text-gray-400 text-sm">Problems</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-400">50+</p>
              <p className="text-gray-400 text-sm">Battles Played</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-400">95%</p>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE (ANIMATION / VISUAL) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >

          <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-3xl opacity-30"></div>

        </motion.div>

      </div>

      {/* FEATURES SECTION */}
      <div className="px-16 py-20">

        <h2 className="text-3xl font-bold text-center text-green-400 mb-12">
          Why SmartCode?
        </h2>

        <div className="grid grid-cols-3 gap-8">

          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold">AI Hints</h3>
            <p className="text-gray-400 mt-2">
              Get intelligent hints instead of full solutions.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold">Battle Mode ⚔️</h3>
            <p className="text-gray-400 mt-2">
              Compete with others in real-time coding battles.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold">Learning Path</h3>
            <p className="text-gray-400 mt-2">
              Follow structured DSA roadmap to improve skills.
            </p>
          </motion.div>

        </div>

      </div>

    </div>
  )
}