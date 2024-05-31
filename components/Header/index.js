import styles from "./header.module.css";
import Link from "next/link";
//import logout 

export default function Header(props) {
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
              <Link href="/faves">Favorites</Link>
            </p>
            <p>
              <Link href="/watch">Want to Watch</Link>
            </p>
            <p>
              <Link href="/watched">Watched</Link>
            </p>
            <p>
              <Link href="/generator">Generator</Link>
            </p>
            <p>
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
            <Link href="/search">Search</Link>
          </p>
          <p>
            <Link href="/signup">Sign Up</Link>
          </p>
          <p>
            <Link href="/login">Login</Link>
          </p>
        </>
      )}
    </header>
  );
}