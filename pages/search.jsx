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
  async function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchPerformed(true)
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
  }

  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Search</h1>
          <div>
            <form onSubmit={handleSubmit}>
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
              <p>Search by keyword and view the first 10 movie and TV show results.</p>
            )}
            {searchPerformed && movieInfo && movieInfo.length === 0 && (
              <p>No movies or shows found.</p>
            )}
            {movieInfo && movieInfo.length > 0 && (
              movieInfo.map((movie) => (
                <div key={movie.imdbID}>
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
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
        <Footer />
      </main>
    </>
  );
}