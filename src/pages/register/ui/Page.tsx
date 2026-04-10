import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";

const RegisterPage = () => {
  const { isDarkMode } = useTheme();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nicknameStatus, setNicknameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkNicknameAvailability = async (rawNickname: string) => {
    const trimmedNickname = rawNickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus("idle");
      return false;
    }

    if (trimmedNickname.length < 3) {
      setNicknameStatus("idle");
      return false;
    }

    try {
      setNicknameStatus("checking");

      const { data: existingNickname, error: nicknameCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname", trimmedNickname)
        .maybeSingle();

      if (nicknameCheckError) {
        setNicknameStatus("idle");
        return false;
      }

      if (existingNickname) {
        setNicknameStatus("taken");
        return false;
      }

      setNicknameStatus("available");
      return true;
    } catch (checkError) {
      console.error("Failed to check nickname:", checkError);
      setNicknameStatus("idle");
      return false;
    }
  };

  const handleNicknameBlur = async () => {
    await checkNicknameAvailability(nickname);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim();

    if (!trimmedNickname || !trimmedEmail || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (trimmedNickname.length < 3) {
      setError("Nickname must be at least 3 characters long.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      const isNicknameAvailable = await checkNicknameAvailability(trimmedNickname);

      if (!isNicknameAvailable) {
        setError("This nickname is already taken.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setError("Failed to create user profile.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email: trimmedEmail,
        nickname: trimmedNickname,
      });

      if (profileError) {
        if (profileError.message.toLowerCase().includes("duplicate")) {
          setError("This nickname is already taken.");
          setNicknameStatus("taken");
        } else {
          setError(profileError.message);
        }
        return;
      }

      setMessage("Registration successful. Check your email for confirmation.");
      setNickname("");
      setEmail("");
      setPassword("");
      setNicknameStatus("idle");
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
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={event => {
                setNickname(event.target.value);
                setNicknameStatus("idle");
              }}
              onBlur={handleNicknameBlur}
              className={styles.input}
            />

            {nicknameStatus === "checking" && (
              <p className={styles.infoText}>Checking nickname...</p>
            )}

            {nicknameStatus === "available" && (
              <p className={styles.success}>Nickname is available.</p>
            )}

            {nicknameStatus === "taken" && (
              <p className={styles.error}>This nickname is already taken.</p>
            )}
          </div>

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