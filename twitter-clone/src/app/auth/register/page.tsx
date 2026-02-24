"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !username || !email || !password || !passwordConfirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });
      const data = await response.json().catch(() => { });
      if (!response.ok) {
        const msg = data?.message || 'Registration failed. Please try again.';
        setError(msg);
        setLoading(false);
        return;
      }
      router.push('/login');
    }
    catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginContainer flex flex-col items-center">
      {/* Twitter Icon */}
      <i className="fa-brands fa-twitter text-sky-500 text-4xl mb-3" suppressHydrationWarning />

      {/* Heading */}
      <h1 className="text-2xl text-black font-bold mb-4 tracking-[8px]">SIGN UP</h1>

      {/* Form */}
      <form
        id="registrationForm"
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full space-y-4"
      >
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          id="confirm-password"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-[25px] p-2 
             focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
             placeholder-gray-500 text-gray-900 focus:outline-none 
             bg-white/80"
        />

        <input
          type="submit"
          value="Register"
          className="w-1/2 bg-sky-500 text-white rounded-full py-2 hover:bg-sky-600 cursor-pointer"
        />
      </form>

      {/* Link to Login */}
      <Link href="/auth/login" className="mt-4 text-sky-500 hover:underline text-sm hover:text-sky-700">
        Already have an account? Login here.
      </Link>
    </div>
  );
}
