// src/app/login/page.tsx

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
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
      const sessionToken = Cookies.get('sessionToken');
  
      if (sessionToken) {
        try {
          const response = await fetch('/api/auth/logout', { method: 'POST' });
          if (response.ok) {
            Cookies.remove('sessionToken');
            Cookies.remove('user_id');
            Cookies.remove('username');
            Cookies.remove('role_id');
            Cookies.remove('branch_id');
            Cookies.remove('branch_name');
            console.log('Session cleared');
          } else {
            console.error('Failed to clear session on /login');
          }
        } catch (error) {
          console.error('Error clearing session:', error);
        }
      } else {
        console.log('No session token found. No need to clear the session.');
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
          // src="/img/divine-jewel-logo.png"
          src="/img/login-bg2.png"
          alt="Logo"
          // width={700}
          // height={600}
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
    </div>
  );
}
