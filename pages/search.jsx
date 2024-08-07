import styles from "../styles/Search.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Head from "next/head";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
      res.redirect("/login")
    }
    return { props };
  },
  sessionOptions
);

export default function Search(props) {
  const [query, setQuery] = useState("");
  const [movieInfo, setMovieInfo] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchPerformed(true)
    setLoading(true)
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_API_KEY}&s=${query}`
      )
      const movieData = await res.json()
      console.log(movieData)
      if (movieData.Response === "True") {
        setMovieInfo(movieData.Search)
        setQuery("")
      } else {
        setMovieInfo([])
        setQuery("")
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.main}>
          <h1 className={styles.searchTitle}>Search</h1>
          <p>Explore movies and TV shows.</p>
          <br />
          <div>
            <form className={styles.searchBarDiv} onSubmit={handleSubmit}>
              <input className={styles.searchBarBox}
                placeholder="Search by title keyword"
                value={query}
                onChange={e => setQuery(e.target.value)}
                type="text"
                name="movie-search" />
              <br />
              <br />
              <button className={styles.searchButton} type="submit">Search</button>
            </form>
          </div>
          <div>
            {!searchPerformed && (
              <br />
            )}
            {searchPerformed && loading && (
              <p>Loading...</p>
            )}
            {searchPerformed && !loading && movieInfo.length === 0 && (
              <p style={{ marginTop: "30px" }}>No movies or shows found.</p>
            )}
            <br />
            <br />
            <div className={styles.searchResults}>
              {movieInfo && movieInfo.length > 0 && (
                movieInfo.map((movie) => (
                  <div key={movie.imdbID}>
                    {movie.Poster !== "N/A" ? (
                      <Link href={`/movie/${movie.imdbID}`}>
                        <img className={styles.bob} src={movie.Poster} alt="Movie Poster" />
                      </Link>
                    ) : (
                      <Link href={`/movie/${movie.imdbID}`}>
                        <img src="/noPoster.png" alt="Poster unavailable" />
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}