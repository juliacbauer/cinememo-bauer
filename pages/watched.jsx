import styles from "../styles/Search.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const watched = await db.watched.getWatched(user._id)
    const props = {}
    if (user) {
      props.isLoggedIn = true
    } else {
      props.isLoggedIn = false
      res.redirect("/login")
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
      <Head>
        <title>Seen</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.main}>
          <h1 className={styles.listTitles}>Seen</h1>
          <div className={styles.totalDiv}>
            <img className={styles.seenIcon} src="/seenIcon.png" alt="Seen icon" />
            <p>Total: {props.watchedList.length}</p>
          </div>
          <br />
          {props.watchedList.length > 0 ? (
            <div className={styles.searchResults}>
              {props.watchedList.map(movie => (
                <div key={movie._id}>
                  {movie.Poster !== "N/A" ? (
                    <Link href={`/movie/${movie.imdbID}`}>
                      <img className={styles.bob} src={movie.poster} alt="Movie Poster" />
                    </Link>
                  ) : (
                    <Link href={`/movie/${movie.imdbID}`}>
                      <img src="/noPoster.png" alt="Poster unavailable" />
                    </Link>
                  )}
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