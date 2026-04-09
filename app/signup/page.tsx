"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Signup() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async () => {

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      setMessage(data.message)

      if (data.message === "User registered successfully") {
        setTimeout(() => {
          router.push("/login")
        }, 1000)
      }

    } catch (error) {
      setMessage("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] p-8 rounded-xl w-[350px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0d1117] border border-gray-700 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0d1117] border border-gray-700 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0d1117] border border-gray-700 rounded-lg"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Create Account
        </button>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-400">
            {message}
          </p>
        )}

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400">
            Login
          </Link>
        </p>

      </motion.div>

    </div>
  )
}