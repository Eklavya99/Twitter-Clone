"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // TODO: Hook this up to your backend login API
    if (!userEmail || !userPassword) {
      setError("Please enter Email & password to login.");
      return;
    }

    setLoading(true);

    try{
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });
      const data = await response.json().catch(() => {});
      if (!response.ok) {
        const msg = data?.message || 'Login failed. Please try again.';
        setError(msg);
        setLoading(false);
        return;
      }
      router.push('/');
    }
    catch (err : any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');      
    }
    finally {
      setLoading(false);
    }
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
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
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
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
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
        href="/auth/register"
        className="mt-4 text-sky-500 hover:underline text-sm"
      >
        Need an account? Register here.
      </Link>
    </div>
  );
}
