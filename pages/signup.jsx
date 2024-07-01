import styles from "../styles/Generator.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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
      if (res.status === 200) return router.push("/dashboard")
      const { error: message } = await res.json()
      setError(message)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <Header isLoggedIn={props.isLoggedIn} />
      <main className={styles.main}>
        <h1>Sign Up</h1>
        <br />
        <form onSubmit={createAccount}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="reenter-password">Re-enter Password: </label>
          <input
            type="password"
            name="reenter-password"
            id="reenter-password"
            onChange={handleChange}
            value={reenterPassword}
          />
          <button>Sign Up</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/login">
          <p>Already have an account? Login &rarr;</p>
        </Link>
        <Footer />
      </main>
    </div>
  );
}