import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) return router.push("/");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Login</h1>
          <br />
          <form className={styles.form} onSubmit={handleLogin}>
            <input
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              value={username}
            />
            <br />
            <input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
            />
            <br />
            <button>Login</button>
            {error && <p>{error}</p>}
          </form>
          <br />
          <br />
          <Link href="/signup">
            <button style={{ cursor: "pointer" }}>
              Sign up instead &rarr;
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}

