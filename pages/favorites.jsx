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
    const favorites = await db.favorites.getFavorites(user._id)
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
        favoritesList: favorites,
      }
    }
  },
  sessionOptions
);


export default function Faves(props) {
  return (
    <>
      <Head>
        <title>Favorites</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.main}>
          <h1 className={styles.listTitles}>Favorites</h1>
          <p>Total: {props.favoritesList.length}</p>
          <br />
          {props.favoritesList.length > 0 ? (
            <div className={styles.searchResults}>
              {props.favoritesList.map(movie => (
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