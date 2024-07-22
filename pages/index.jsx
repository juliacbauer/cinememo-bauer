import styles from "@/styles/Home.module.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";
import Link from "next/link";
import Head from "next/head";

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
      <Head>
        <title>Cinememo</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.main}>
          {props.isLoggedIn ? (
            <>
              <div className={styles.dashBoard}>
                <h1 className={styles.dashUser}>Welcome, {props.user.username}.</h1>
                <div className={styles.dashAmounts}>
                  <div className={styles.iconDiv}>
                    <Link href="/watch">
                      <img className={`${styles.bob} ${styles.mainIcons}`} src="/popcornIcon.png" alt="Popcorn icon" />
                    </Link>
                    <br />
                    <Link href="/watch">
                      <img className={styles.watchIcon} src="/watchIcon.png" alt="Watch icon" />
                    </Link>
                    <Link href="/watch" style={{ textDecoration: "none", color: "inherit" }}>
                      <p className={styles.iconAmounts}>Watch: {props.watchList.length}</p>
                    </Link>
                  </div>
                  <div className={styles.iconDiv}>
                    <Link href="/watched">
                      <img className={`${styles.bob} ${styles.mainIcons}`} src="/reelIcon.png" alt="Reel icon" />
                    </Link>
                    <br />
                    <Link href="/watched">
                      <img className={styles.seenIcon} src="/seenIcon.png" alt="Seen icon" />
                    </Link>
                    <Link href="/watched" style={{ textDecoration: "none", color: "inherit" }}>
                      <p className={styles.iconAmounts}>Seen: {props.watchedList.length}</p>
                    </Link>
                  </div>
                  <div className={styles.iconDiv}>
                    <Link href="/favorites">
                      <img className={`${styles.bob} ${styles.mainIcons}`} src="/ticketIcon.png" alt="Ticket icon" />
                    </Link>
                    <br />
                    <Link href="/favorites">
                      <img className={styles.favesIcon} src="/favesIcon.png" alt="Favorites icon" />
                    </Link>
                    <Link href="/favorites" style={{ textDecoration: "none", color: "inherit" }}>
                      <p className={styles.iconAmounts}>Favorites: {props.favoritesList.length}</p>
                    </Link>
                  </div>
                </div>
                <p className={`${styles.appDescription} ${styles.dashBtnText}`}>Search for something or generate a random pick.</p>
                <br />
                <div className={styles.buttonDiv}>
                  <Link href="/search">
                    <button className={styles.buttons}>
                      Search
                    </button>
                  </Link>
                  <Link href="/generator">
                    <button className={styles.buttons}>
                      Randomize
                    </button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.home}>
                <img className={styles.logo} src="/logo.png" alt="Cinememo logo" />
                <br />
                <h1 className={styles.wordMark}>Cinememo</h1>
                <h2>For movie addicts and TV show fanatics. </h2>
                <p className={styles.appDescription}>Light-hearted rom coms, thrilling docuseries, feel-good classics – no matter your taste, Cinememo allows you to hone in on your niche or expand your horizons.</p>
                <p className={styles.appDescription}>Sign up or login to discover and track endless movies and TV shows.</p>
                <br />
                <div className={styles.buttonDiv}>
                  <Link href="/login">
                    <button className={styles.buttons}>
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className={styles.buttons}>
                      Sign up
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}