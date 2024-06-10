import User from "../models/user";
import dbConnect from "../connection";

export async function getWatched(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  console.log(user.watchedList)
  if (!user) return null
  return JSON.parse(JSON.stringify(user.watchedList))
}

export async function addToWatched(userId, movie) {
  await dbConnect()
  const user = await User.findById(userId)
  if (!user) {
    return null
  }
  const existingMovie = user.watchedList.find(
    (movieRepeat) => movieRepeat.imdbID === movie.imdbID
  )
  if (existingMovie) {
    console.log("Movie already in list:", existingMovie)
    return false
  }
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { watchedList: movie } },
    { new: true }
  )
  return movie
}

export async function removeWatchedMovie(userId, imdbID) {
  console.log("Movie to remove", imdbID)
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { watchedList: { imdbID } } },
    { new: true }
  )
  if (!user) return null
  return true
}