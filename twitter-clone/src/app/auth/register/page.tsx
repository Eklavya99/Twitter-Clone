"use client";

import Link from "next/link";
import { useState } from "react";
//import { FaTwitter } from "react-icons/fa6";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple password match validation
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match. Please try again!");
      return;
    }

    setError("");
    console.log("Registering:", formData);

    // TODO: hook up to backend API
    // fetch("/api/register", { method: "POST", body: JSON.stringify(formData) })
  };

  return (
    <div className="loginContainer flex flex-col items-center">
      {/* Twitter Icon */}
      <i className="fa-brands fa-twitter text-sky-500 text-4xl mb-3" suppressHydrationWarning/>

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
          value={formData.firstName}
          onChange={handleChange}
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
          value={formData.lastName}
          onChange={handleChange}
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
          value={formData.username}
          onChange={handleChange}
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
          value={formData.email}
          onChange={handleChange}
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
          value={formData.password}
          onChange={handleChange}
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
          value={formData.passwordConfirm}
          onChange={handleChange}
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
      <Link href="/login" className="mt-4 text-sky-500 hover:underline text-sm hover:text-sky-700">
        Already have an account? Login here.
      </Link>
    </div>
  );
}
