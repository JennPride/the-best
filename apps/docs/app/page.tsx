"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Mode = "register" | "login";

export default function Home() {
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error =
          (data && (data.error || data.message)) ||
          "Something went wrong";
        setMessage(error);
        setToken(null);
        return;
      }

      if (data.token) {
        setToken(data.token);
        setMessage(
          mode === "register"
            ? "User created and logged in!"
            : "Logged in successfully!"
        );
      } else {
        setMessage("Request succeeded but no token was returned.");
      }
    } catch (error) {
      setMessage("Network error. Is the API running?");
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>The Best</h1>

        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              mode === "register" ? styles.toggleButtonActive : ""
            }`}
            onClick={() => setMode("register")}
            disabled={loading}
          >
            Create account
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              mode === "login" ? styles.toggleButtonActive : ""
            }`}
            onClick={() => setMode("login")}
            disabled={loading}
          >
            Log in
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            <span>Email</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className={styles.label}>
            <span>Password</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </label>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : mode === "register"
              ? "Create account"
              : "Log in"}
          </button>
        </form>
      </main>
    </div>
  );
}
