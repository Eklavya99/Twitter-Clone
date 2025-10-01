"use client";

import Link from "next/link";
import { useState } from "react";
//import { FaTwitter } from "react-icons/fa6";

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("logUser") as string;
    const password = formData.get("logUserPassword") as string;

    // TODO: Hook this up to your backend login API
    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    console.log("Logging in with:", { username, password });
    setError(""); // clear error
  };

  return (
    <div className="loginContainer flex flex-col items-center">
      {/* Twitter Icon */}
      <i className="fa-twitter fa-brands text-sky-500 text-4xl mb-3" suppressHydrationWarning/>

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4 text-[black] tracking-[8px]">SIGN IN </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full space-y-4"
      >
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="logUser"
          placeholder="Username or Email"
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          type="password"
          name="logUserPassword"
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />


        <input
          type="submit"
          value="Login"
          className="w-1/2 bg-sky-500 text-white rounded-full py-2 hover:bg-sky-900 cursor-pointer"
        />
      </form>

      {/* Link to Register */}
      <Link
        href="/register"
        className="mt-4 text-sky-500 hover:underline text-sm"
      >
        Need an account? Register here.
      </Link>
    </div>
  );
}
