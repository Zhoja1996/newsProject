import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";

const RegisterPage = () => {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Registration successful. Check your email for confirmation.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Unexpected error during registration.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>Create account</h1>

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
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {message ? <p className={styles.success}>{message}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;