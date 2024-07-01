import styles from "@/styles/Dashboard.module.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
      const user = req.session.user
      const watch = await db.watch.getWatch(user._id)
      const watched = await db.watched.getWatched(user._id)
      const favorites = await db.favorites.getFavorites(user._id)
      const props = {}
      if (user) {
        props.isLoggedIn = true
      } else {
        props.isLoggedIn = false
      }
      return {
        props: {
          user: req.session.user,
          isLoggedIn: true,
          watchList: watch,
          watchedList: watched,
          favoritesList: favorites,
        }
      }
    },
    sessionOptions
  );

export default function Dash(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>User Dashboard</h1>
          {props.isLoggedIn ? (
            <div>
              <p>Hi {props.user.username}!</p>
              <p>Movies in Watch List: {props.watchList.length}</p>
              <p>Movies in Watched List: {props.watchedList.length}</p>
              <p>Favorites: {props.favoritesList.length}</p>
            </div>
          ) : (
            <p>Log in or create an account to access your dashboard.</p>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}