import styles from "./Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header(props) {
  console.log("Props:", props.isLoggedIn);
  const router = useRouter();
  const [displayLists, setDisplayLists] = useState();
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.status === 200)
        router.push("/")
    } catch (err) {
      console.log(err)
    }
  }
  function onClickLists() {
    setDisplayLists(prevDisplayLists => !prevDisplayLists);
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
              <Link href="/search">Search</Link>
            </p>
            <div className={styles.links} onClick={onClickLists} style={{ cursor: "pointer" }}>
              My Lists
              {displayLists && (
                <div className={styles.displayLists}>
                  <p><Link href="/watch">Want to Watch</Link></p>
                  <p><Link href="/watched">Watched</Link></p>
                  <p><Link href="/favorites">Favorites</Link></p>
                </div>
              )}
            </div>
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