"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }

      return data;
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    handleLogin(username, password);
  }
  return (
    <div className="flex flex-row">
      <div className="w-2/3 h-screen flex items-center justify-center bg-gradient-to-t from-pink-300 to-pink-100">
        <Image
          src="/img/divine-jewel-logo.png"
          alt="Logo"
          width={800}
          height={800}
          className="mb-4"
        />
      </div>
      <div className="bg-[#f5f5f5] w-1/3 h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md h-[70vh]">
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold mb-6 text-left">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 mb-2 text-lg"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3 py-2 rounded-xl border-white bg-pink-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 mb-2 text-lg"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 rounded-xl border-white bg-pink-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="location"
                  className="block text-gray-700 mb-2 text-lg"
                >
                  Location
                </label>
                <select
                  id="location"
                  value={[]}
                  // onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-white bg-pink-100"
                  required
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  <option value="1">Location 1</option>
                  <option value="2">Location 2</option>
                  <option value="3">Location 3</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FCB6D7] text-lg text-white py-4 rounded-xl hover:bg-[#FA85BC] transition duration-200"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
