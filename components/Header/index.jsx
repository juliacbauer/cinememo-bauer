import styles from "./header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header(props) {
  console.log("Props:", props.isLoggedIn)
  const router = useRouter()
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.status === 200)
        router.push("/")
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <header className={styles.container}>
      {props.isLoggedIn ? (
        <>
          <p>
            <Link href="/">Home</Link>
          </p>
          <div className={styles.container}>
            <p>
              <Link href="/search">Search</Link>
            </p>
            <p>
              <Link href="/watch">Want to Watch</Link>
            </p>
            <p>
              <Link href="/watched">Watched</Link>
            </p>
            <p>
              <Link href="/faves">Favorites</Link>
            </p>
            <p>
              <Link href="/generator">Generator</Link>
            </p>
            <p onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p>
            <Link href="/">Home</Link>
          </p>
          <p>
            <Link href="/signup">Sign Up</Link>
          </p>
          <p>
            <Link href="/login">Login</Link>
          </p>
          <p>
            <Link href="/search">Search</Link>
          </p>
          <p>
            <Link href="/watch">Want to Watch</Link>
          </p>
          <p>
            <Link href="/watched">Watched</Link>
          </p>
          <p>
            <Link href="/favorites">Favorites</Link>
          </p>
          <p>
            <Link href="/generator">Generator</Link>
          </p>
        </>
      )}
    </header>
  )
}