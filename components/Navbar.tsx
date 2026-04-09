"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center px-10 py-4 bg-[#0d1117] border-b border-gray-800"
    >
      <h1 className="text-2xl font-bold text-green-400">
        SmartCode
      </h1>

      <div className="flex gap-6 text-gray-300">

        <Link href="/" className="hover:text-green-400 transition">
          Home
        </Link>

        <Link href="/problems" className="hover:text-green-400 transition">
          Problems
        </Link>

        <Link href="/solve" className="hover:text-green-400 transition">
          Solve
        </Link>

        <Link href="/battle" className="hover:text-green-400 transition">
          Battle
        </Link>

        <Link href="/leaderboard" className="hover:text-green-400 transition">
          Leaderboard
        </Link>
        <Link href="/login" className="hover:text-green-400 transition">
          Login
        </Link>

      </div>
    </motion.nav>
  )
}