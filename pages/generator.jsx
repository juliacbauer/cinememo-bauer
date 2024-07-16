import { useState } from "react";
import styles from "../styles/Generator.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import { redirect } from "next/dist/server/api-utils";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const props = {}
    if (user) {
      props.isLoggedIn = true
    } else {
      props.isLoggedIn = false
      res.redirect("/login")
    }
    return { props }
  },
  sessionOptions
);

export default function Generator(props) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleGenerator() {
    try {
      setLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_API_KEY}&type=movie&i=tt${String(Math.floor(Math.random() * 1000000) + 1).padStart(7, "0")}`)
      const movieData = await res.json()
      console.log(movieData)
      if (movieData.Response === "True" && movieData.Type !== "episode" && movieData.Type !== "series" && movieData.Poster !== "N/A") {
        setMovie(movieData)
      } else {
        await handleGenerator()
      }
    } catch (error) {
      console.error("Error fetching random movie:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Random Movie Generator</h1>
          <p>Desperate times call for desperate measures!</p>
          <br />
          <button onClick={handleGenerator}>Randomize</button>
          <br />
          {loading ? (
            <p>Generating movie...</p>
          ) : (
            movie && (
              <div>
                <div className={styles.links}>
                  <Link href={`/movie/${movie.imdbID}`}>
                    <h2>{movie.Title} ({movie.Year})</h2>
                  </Link>
                </div>
                <Link href={`/movie/${movie.imdbID}`}>
                  <img className={styles.mobileImg} src={movie.Poster} alt="Movie Poster" />
                </Link>
              </div>
            )
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
