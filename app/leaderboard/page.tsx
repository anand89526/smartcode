"use client"

import Navbar from "../../components/Navbar"
import { motion } from "framer-motion"

export default function Leaderboard() {

  const users = [
    { rank: 1, name: "Kumar Anand", score: 980 },
    { rank: 2, name: "Rahul Sharma", score: 870 },
    { rank: 3, name: "Priya Singh", score: 820 },
    { rank: 4, name: "Aman Verma", score: 790 },
    { rank: 5, name: "Neha Gupta", score: 760 }
  ]

  return (
    <div className="bg-[#0d1117] text-white min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-3xl font-bold text-green-400 mb-8">
          Leaderboard 🏆
        </h1>

        <div className="space-y-4">

          {users.map((user, index) => (

            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="flex justify-between items-center bg-[#161b22] p-5 rounded-xl border border-gray-800"
            >

              <div className="flex items-center gap-6">

                <span className="text-lg font-bold text-green-400">
                  #{user.rank}
                </span>

                <span className="text-lg">
                  {user.name}
                </span>

              </div>

              <div className="flex items-center gap-6">

                <span className="text-gray-400">
                  {user.score} pts
                </span>

                <span className="text-sm text-green-400">
                  ● Online
                </span>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>
  )
}