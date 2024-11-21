'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../components/styles/PublicForm.module.css';
import CircularIndeterminate from '@/components/loading/Loading';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
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
        const responseData = await response.json();
        const roleId = responseData.role_id;

        if (roleId === 1 || roleId === 2) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setTimeout(() => {
            router.push('/orders');
          }, 1000);
        }

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
    } finally {
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

        <div className={styles.passwordInputContainer}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.passwordInput}
          />

          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              className="text-sm"
            />
          </button>
        </div>

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