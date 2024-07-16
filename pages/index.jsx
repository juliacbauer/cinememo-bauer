import styles from "@/styles/Home.module.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";
import Link from "next/link";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    let watchList = [];
    let watchedList = [];
    let favoritesList = [];
    if (user) {
      watchList = await db.watch.getWatch(user._id)
      watchedList = await db.watched.getWatched(user._id)
      favoritesList = await db.favorites.getFavorites(user._id)
    }
    return {
      props: {
        user: user || null,
        isLoggedIn: user?.username ? true : false,
        watchList,
        watchedList,
        favoritesList,
      },
    };
  },
  sessionOptions
);

export default function Home(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          {props.isLoggedIn ? (
            <>
              <h1>Welcome {props.user.username}!</h1>
              <div className={styles.dashAmounts}>
                <p>Titles to watch: {props.watchList.length}</p>
                <p>Titles you've seen: {props.watchedList.length}</p>
                <p>Favorites: {props.favoritesList.length}</p>
              </div>
              <p className={styles.appDescription}>Looking to explore more cinema? Search for new movies and TV shows or generate a random pick!</p>
              <br />
              <div className={styles.buttonDiv}>
                <Link href="/search">
                  <button className={styles.buttons} style={{ cursor: "pointer" }}>
                    Discover
                  </button>
                </Link>
                <Link href="/generator">
                  <button className={styles.buttons} style={{ cursor: "pointer" }}>
                    Randomize
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Cinememo</h1>
              <h2>For movie addicts and TV show fanatics. </h2>
              <p className={styles.appDescription}>Light-hearted rom coms, thrilling docuseries, feel-good classics – no matter your taste, Cinememo gives you the opportunity to hone in on your niche and expand your horizons.</p>
              <p className={styles.appDescription}>Sign up or login today to discover and track endless movies and TV shows.</p>
              <br />
              <div className={styles.buttonDiv}>
                <Link href="/login">
                  <button className={styles.buttons} style={{ cursor: "pointer" }}>
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className={styles.buttons} style={{ cursor: "pointer" }}>
                    Sign up
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}