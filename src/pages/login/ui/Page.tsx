import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Login successful.");
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (err) {
      setError("Unexpected error during login.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>Log in</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={styles.input}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {message ? <p className={styles.success}>{message}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <p className={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;