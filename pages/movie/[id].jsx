import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function MovieInfo() {
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
      console.log(movieData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  useEffect(() => {
    if (id) {
      handleInfo(id)
    }
  }, [id])

  return (
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
    </div>
  )
}