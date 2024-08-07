import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "./Movie.module.css"
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from "../../db";
import Head from "next/head";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const props = {}
    const watch = await db.watch.getWatch(user._id)
    const watched = await db.watched.getWatched(user._id)
    const favorites = await db.favorites.getFavorites(user._id)
    if (user) {
      props.user = req.session.user
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

export default function MovieInfo(props) {
  const router = useRouter();
  const { id } = router.query;
  const [movieInfo, setMovieInfo] = useState(null);
  const { watchList, watchedList, favoritesList } = props;
  const [message, setMessage] = useState("")
  async function handleInfo(imdbId) {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_API_KEY}&i=${imdbId}`
      )
      const movieData = await res.json()
      setMovieInfo(movieData)
      console.log(movieInfo)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  useEffect(() => {
    if (id) {
      handleInfo(id)
    }
  }, [id])

  const inWatchList = watchList.find(movie => movie.imdbID === id);
  const inWatchedList = watchedList.find(movie => movie.imdbID === id);
  const inFavoritesList = favoritesList.find(movie => movie.imdbID === id);

  async function addToWatch(e) {
    e.preventDefault()
    setMessage("Loading...")
    console.log(movieInfo)
    const res = await fetch("/api/watch", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        imdbID: movieInfo.imdbID,
        title: movieInfo.Title,
        year: parseInt(movieInfo.Year, 10),
        poster: movieInfo.Poster
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title added")
      console.log("Movie added to Watch List:", movieInfo)
    }
  }

  async function addToWatched(e) {
    e.preventDefault()
    setMessage("Loading...")
    console.log(movieInfo)
    const res = await fetch("/api/watched", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        imdbID: movieInfo.imdbID,
        title: movieInfo.Title,
        year: parseInt(movieInfo.Year, 10),
        poster: movieInfo.Poster
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title added")
      console.log("Movie added to Watched List:", movieInfo)
    }
  }

  async function addToFavorites(e) {
    e.preventDefault()
    setMessage("Loading...")
    console.log(movieInfo)
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        imdbID: movieInfo.imdbID,
        title: movieInfo.Title,
        year: parseInt(movieInfo.Year, 10),
        poster: movieInfo.Poster
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title added")
      console.log("Movie added to Favorites List:", movieInfo)
    }
  }

  async function removeWatchMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    setMessage("Loading...")
    const res = await fetch("/api/watch", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title removed")
      console.log("Movie removed from Watch List:", movieInfo)
    }
  }

  async function removeWatchedMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    setMessage("Loading...")
    const res = await fetch("/api/watched", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title removed")
      console.log("Movie removed from Watched List:", movieInfo)
    }
  }

  async function removeFavoriteMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    setMessage("Loading...")
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath, undefined, { scroll: false })
      setMessage("Title removed")
      console.log("Movie removed from Favorites List:", movieInfo)
    }
  }

  return (
    <>
      <Head>
        <title>Title Details</title>
        <meta name="description" content="Cinememo: For movie addicts and TV show fanatics." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <div className={styles.idMain}>
          {movieInfo ? (
            <div className={styles.posterLeft}>
              {movieInfo.Poster !== "N/A" ? (
                <img className={styles.poster} src={movieInfo.Poster} alt="Movie Poster" />
              ) : (
                <img className={styles.noPoster} src="/noPoster.png" alt="Poster unavailable" />
              )}
              <div className={styles.infoRight}>
                <h1 className={styles.title}>{movieInfo.Title} ({movieInfo.Year})</h1>
                <p>{movieInfo.Type && movieInfo.Type.charAt(0).toUpperCase() + movieInfo.Type.slice(1)} | {movieInfo.Genre} | IMDb Rating: {movieInfo.imdbRating}</p>
                <p>Featuring {movieInfo.Actors}</p>
                <p className={styles.plot}>{movieInfo.Plot}</p>
                <br />
                <div className={styles.idButtonDiv}>
                  {!inWatchList && <button className={styles.idButtons} onClick={addToWatch}>
                    Watch</button>}
                  {inWatchList && <button className={`${styles.idButtons} ${styles.removeBtn}`} onClick={() => removeWatchMovie(movieInfo)}>
                    Remove</button>}
                  {!inWatchedList && <button className={styles.idButtons} onClick={addToWatched}>
                    Seen</button>}
                  {inWatchedList && <button className={`${styles.idButtons} ${styles.removeBtn}`} onClick={() => removeWatchedMovie(movieInfo)}>
                    Remove</button>}
                  {!inFavoritesList && <button className={styles.idButtons} onClick={addToFavorites}>
                    Favorites</button>}
                  {inFavoritesList && <button className={`${styles.idButtons} ${styles.removeBtn}`} onClick={() => removeFavoriteMovie(movieInfo)}>
                    Remove</button>}
                </div>
                <br />
                <br />
                {message && <p>{message}</p>}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <Footer />
      </main>
    </>
  )
}