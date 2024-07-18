import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Signup(props) {
  const router = useRouter()
  const [
    { username, password, "reenter-password": reenterPassword },
    setForm,
  ] = useState({
    username: "",
    password: "",
    "reenter-password": "",
  })
  const [error, setError] = useState("")

  function handleChange(e) {
    setForm({
      username,
      password,
      "reenter-password": reenterPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    })
  }
  async function createAccount(e) {
    e.preventDefault()
    if (!username) return setError("Must create username.")
    if (password !== reenterPassword) return setError("Passwords must match.")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      if (res.status === 200) return router.push("/")
      const { error: message } = await res.json()
      setError(message)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <Head>
        <title>Sign up</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.main}>
          <h1>Sign Up</h1>
          <br />
          <form className={styles.form} onSubmit={createAccount}>
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
            <input
              placeholder="Confirm password"
              type="password"
              name="reenter-password"
              id="reenter-password"
              onChange={handleChange}
              value={reenterPassword}
            />
            <br />
            <button style={{ cursor: "pointer" }}>Sign Up</button>
            {error && <p>{error}</p>}
          </form>
          <br />
          <br />
          <Link href="/login">
            <button style={{ cursor: "pointer" }}>
              Log in instead &rarr;
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}