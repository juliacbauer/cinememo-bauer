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
    const watched = await db.watched.getWatched(user._id)
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
        watchedList: watched,
      }
    }
  },
  sessionOptions
);

export default function Watched(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Watched</h1>
          {props.watchedList.length > 0 ? (
            <div className={styles.searchResults}>
              {props.watchedList.map(movie => (
                <div key={movie._id}>
                  <h2>{movie.title}</h2>
                  <p>Year: {movie.year}</p>
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