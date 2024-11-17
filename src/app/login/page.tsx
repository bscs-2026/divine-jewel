<<<<<<< HEAD
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../components/styles/PublicForm.module.css';
import CircularIndeterminate from '@/components/loading/Loading';
import Image from "next/image";

interface Branch {
  id: number;
  name: string;
  address_line: string;
}

export default function LoginPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function clearSession() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          console.log('Session cleared via /api/auth/logout');
        // } else {
        //     console.error('Failed to clear session on /login');
        //
        }
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }

    clearSession();
  }, []);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch('/api/stocks/branches');
        if (response.ok) {
          const data = await response.json();
          setBranches(data.branches);
        } else {
          console.error('Failed to fetch branches');
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedBranch || !username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, branch: selectedBranch }),
      });

      if (response.ok) {
        // Add a 1-second delay before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        console.error('Failed to log in');
        const errorResponse = await response.json();
        alert(errorResponse.error || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An unexpected error occurred.');
      setLoading(false);
    }
  }

  const isButtonDisabled = loading || !username || !password || !selectedBranch;

  return (
    <div className={styles.loginContainer}>
      {loading && (
        <CircularIndeterminate />
      )}

      <div className={styles.coverPhoto}>
        <img
          src="/img/login-bg2.png"
          alt="Logo"
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <select
          id="branch"
          name="branch"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          required
          className={styles.select}
        >
          <option value="">Select a branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.button} disabled={isButtonDisabled}>
          Login
        </button>
      </form>
=======
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
>>>>>>> 8d4ee7a (created sales page)
    </div>
  );
}
