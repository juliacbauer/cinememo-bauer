import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const props = {}
    if (user) {
      props.user = req.session.user
      props.isLoggedIn = true
    } else {
      props.isLoggedIn = false
    }
    return { props }
  },
  sessionOptions
);

export default function MovieInfo(props) {
  const router = useRouter();
  const { id } = router.query;
  const [movieInfo, setMovieInfo] = useState([]);
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

  async function addToWatch(e) {
    e.preventDefault()
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
        poster: movieInfo.Poster,
        filmType: movieInfo.Type,
        genres: movieInfo.Genre,
        runtime: movieInfo.Runtime,
        actors: movieInfo.Actors,
        plot: movieInfo.Plot,
        rated: movieInfo.Rated,
        directors: movieInfo.Director,
        ratings: movieInfo.Ratings.map(rating => ({
          source: rating.Source,
          value: rating.Value
        })),
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie added to Watch List:", movieInfo)
    }
  }

  async function addToWatched(e) {
    e.preventDefault()
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
        poster: movieInfo.Poster,
        filmType: movieInfo.Type,
        genres: movieInfo.Genre,
        runtime: movieInfo.Runtime,
        actors: movieInfo.Actors,
        plot: movieInfo.Plot,
        rated: movieInfo.Rated,
        directors: movieInfo.Director,
        ratings: movieInfo.Ratings.map(rating => ({
          source: rating.Source,
          value: rating.Value
        })),
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie added to Watched List:", movieInfo)
    }
  }

  async function addToFavorites(e) {
    e.preventDefault()
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
        poster: movieInfo.Poster,
        filmType: movieInfo.Type,
        genres: movieInfo.Genre,
        runtime: movieInfo.Runtime,
        actors: movieInfo.Actors,
        plot: movieInfo.Plot,
        rated: movieInfo.Rated,
        directors: movieInfo.Director,
        ratings: movieInfo.Ratings.map(rating => ({
          source: rating.Source,
          value: rating.Value
        })),
      }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie added to Favorites List:", movieInfo)
    }
  }

  async function removeWatchMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    const res = await fetch("/api/watch", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie removed from Watch List:", movieInfo)
    }
  }

  async function removeWatchedMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    const res = await fetch("/api/watched", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie removed from Watched List:", movieInfo)
    }
  }

  async function removeFavoriteMovie(movieId) {
    console.log("Removing movie with ID:", movieId)
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID }),
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie removed from Favorites List:", movieInfo)
    }
  }

  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div>
          {movieInfo ? (
            <>
              <h1>{movieInfo.Title}</h1>
              <img src={movieInfo.Poster} alt="Movie Poster" />
              <p>{movieInfo.Year}</p>
              <p>Genres: {movieInfo.Genre}</p>
              <p>Plot Summary: {movieInfo.Plot}</p>
              <p>Cast: {movieInfo.Actors}</p>
              <p>IMDb Rating: {movieInfo.imdbRating}</p>
            </>
          ) : id ? (
            <p>Loading...</p>
          ) : null}
          <button onClick={addToWatch}>
            Add to Watch</button>
          <button onClick={addToWatched}>
            Add to Watched</button>
          <button onClick={addToFavorites}>
            Add to Favorites</button>
          <button onClick={() => removeWatchMovie(movieInfo)}>
            Remove from watch</button>
          <button onClick={() => removeWatchedMovie(movieInfo)}>
            Remove from watched</button>
          <button onClick={() => removeFavoriteMovie(movieInfo)}>
            Remove from favorites</button>
        </div>
        <Footer />
      </main>
    </>
  )
}