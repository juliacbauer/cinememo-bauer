import styles from "@/styles/Home.module.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";

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
              <h1>User Dashboard</h1>
              <div>
                <p>Hi {props.user.username}!</p>
                <p>Movies in Watch List: {props.watchList.length}</p>
                <p>Movies in Watched List: {props.watchedList.length}</p>
                <p>Favorites: {props.favoritesList.length}</p>
              </div>
            </>
          ) : (
            <>
              <h1>Welcome to Cinememo!</h1>
              <p>Log in or sign up to get started!</p>
            </>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}