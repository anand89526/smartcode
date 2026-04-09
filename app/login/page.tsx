"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async () => {

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      setMessage(data.message)

      if (data.message === "Login successful") {
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }

    } catch (error) {
  console.log(error)
  setMessage("Check console")
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
          Login
        </h2>

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
          onClick={handleLogin}
          className="w-full py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Login
        </button>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-400">
            {message}
          </p>
        )}

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-green-400">
            Sign up
          </Link>
        </p>

      </motion.div>

    </div>
  )
}