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
          <div className={styles.logoLeft}>
            <p className={styles.links}>
              <Link href="/"><img className={`${styles.logo} ${styles.bob}`} src="/logo.png" alt="Logo" /></Link>
            </p>
          </div>
          <div className={styles.rightLinks}>
            <p className={styles.links}>
              <Link href="/search">Search</Link>
            </p>
            <div onClick={onClickLists} style={{ cursor: "pointer" }}>
              <p className={styles.links}>
                My Lists
              </p>
              {displayLists && (
                <div className={styles.displayLists}>
                  <p className={styles.links}><Link href="/watch">Watch</Link></p>
                  <p className={styles.links}><Link href="/watched">Seen</Link></p>
                  <p className={styles.links}><Link href="/favorites">Favorites</Link></p>
                </div>
              )}
            </div>
            <p className={styles.links}>
              <Link href="/generator">Randomize</Link>
            </p>
            <p className={styles.links} onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.logoLeft}>
            <p className={styles.links}>
              <Link href="/"><img className={`${styles.logo} ${styles.bob}`} src="/logo.png" alt="Logo" /></Link>
            </p >
          </div>
          <div className={styles.rightLinks}>
            <p className={styles.links}>
              <Link href="/signup">Sign Up</Link>
            </p>
            <p className={styles.links}>
              <Link href="/login">Login</Link>
            </p>
          </div>
        </>
      )}
    </header>
  );
}