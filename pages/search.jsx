import styles from "../styles/Search.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
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
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Discover</h1>
          <p>Explore endless movies and TV shows.</p>
          <br />
          <div>
            <form className={styles.searchBarDiv} onSubmit={handleSubmit}>
              <input
                placeholder="Search by keyword"
                value={query}
                onChange={e => setQuery(e.target.value)}
                type="text"
                name="movie-search" />
              <br />
              <br />
              <button type="submit">Submit</button>
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
              <p>No movies or shows found.</p>
            )}
            <br />
            <div className={styles.searchResults}>
              {movieInfo && movieInfo.length > 0 && (
                movieInfo.map((movie) => (
                  <div key={movie.imdbID}>
                    <div className={styles.links}>
                      <Link href={`/movie/${movie.imdbID}`}>
                        <h2>{movie.Title} ({movie.Year})</h2>
                      </Link>
                    </div>
                    {movie.Poster !== "N/A" ? (
                      <Link href={`/movie/${movie.imdbID}`}>
                        <img src={movie.Poster} alt="Movie Poster" />
                      </Link>
                    ) : (
                      <p>Poster unavailable.</p>
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