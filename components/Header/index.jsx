import styles from "./Header.module.css";
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
          <div className={styles.container}>
            <p className={styles.links}>
              <Link href="/">Home</Link>
            </p>
            <p className={styles.links}>
              <Link href="/dashboard">Dashboard</Link>
            </p>
            <p className={styles.links}>
              <Link href="/search">Search</Link>
            </p>
            <p className={styles.links}>
              <Link href="/watch">Want to Watch</Link>
            </p>
            <p className={styles.links}>
              <Link href="/watched">Watched</Link>
            </p>
            <p className={styles.links}>
              <Link href="/favorites">Favorites</Link>
            </p>
            <p className={styles.links}>
              <Link href="/generator">Generator</Link>
            </p>
            <p onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p className={styles.links}>
            <Link href="/">Home</Link>
          </p >
          <p className={styles.links}>
            <Link href="/signup">Sign Up</Link>
          </p>
          <p className={styles.links}>
            <Link href="/login">Login</Link>
          </p>
        </>
      )}
    </header>
  );
}