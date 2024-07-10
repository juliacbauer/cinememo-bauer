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
              <div>
                <p>Watch List: {props.watchList.length}</p>
                <p>Watched List: {props.watchedList.length}</p>
                <p>Favorites: {props.favoritesList.length}</p>
              </div>
            </>
          ) : (
            <>
              <h1>Welcome to Cinememo!</h1>
              <div className={styles.buttonDiv}>
                <Link href="/login">
                  <button className={styles.buttons} style={{ cursor: "pointer" }}>
                    Log in
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