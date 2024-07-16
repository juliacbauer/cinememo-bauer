import styles from "../styles/Search.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";
import Link from "next/link";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const watch = await db.watch.getWatch(user._id)
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
      }
    }
  },
  sessionOptions
);

export default function Watch(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1 className={styles.listTitles}>To Watch</h1>
          <p>Total: {props.watchList.length}</p>
          <br />
          <br />
          {props.watchList.length > 0 ? (
            <div className={styles.searchResults}>
              {props.watchList.map(movie => (
                <div key={movie._id}>
                  <Link href={`/movie/${movie.imdbID}`}>
                    <img src={movie.poster} alt="Movie poster" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Visit the search page to start adding movies.</p>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}