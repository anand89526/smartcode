"use client"

import Navbar from "../../components/Navbar"
import { motion } from "framer-motion"

export default function Dashboard() {
  return (
    <div className="bg-[#0d1117] text-white min-h-screen">

      <Navbar />

      <div className="p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Dashboard
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-6">

          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-gray-400">Problems Solved</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-gray-400">Current Streak</h3>
            <p className="text-2xl font-bold mt-2">5 Days</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#161b22] p-6 rounded-xl"
          >
            <h3 className="text-gray-400">Ranking</h3>
            <p className="text-2xl font-bold mt-2">#120</p>
          </motion.div>

        </div>

        {/* Activity Section */}
        <div className="mt-10">

          <h2 className="text-xl mb-4 text-gray-300">
            Recent Activity
          </h2>

          <div className="bg-[#161b22] p-6 rounded-xl">

            <p className="text-gray-400">
              ✔ Solved "Two Sum"
            </p>

            <p className="text-gray-400 mt-2">
              ✔ Solved "Binary Search"
            </p>

            <p className="text-gray-400 mt-2">
              ✔ Participated in Battle
            </p>

          </div>

        </div>

      </div>

    </div>
  )
} 