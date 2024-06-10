import User from "../models/user";
import dbConnect from "../connection";

export async function getFavorites(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  console.log(user.favoritesList)
  if (!user) return null
  return JSON.parse(JSON.stringify(user.favoritesList))
}

export async function addToFavorites(userId, movie) {
  await dbConnect()
  const user = await User.findById(userId)
  if (!user) {
    return null
  }
  const existingMovie = user.favoritesList.find(
    (movieRepeat) => movieRepeat.imdbID === movie.imdbID
  )
  if (existingMovie) {
    console.log("Movie already in list:", existingMovie)
    return false
  }
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoritesList: movie } },
    { new: true }
  )
  return movie
}

export async function removeFavoriteMovie(userId, imdbID) {
  console.log("Movie to remove", imdbID)
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoritesList: { imdbID } } },
    { new: true }
  )
  if (!user) return null
  return true
}