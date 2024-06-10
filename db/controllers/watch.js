import User from "../models/user";
import dbConnect from "../connection";

export async function getWatch(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  console.log("Movies:", user.watchList)
  if (!user) return null
  return JSON.parse(JSON.stringify(user.watchList))
}

export async function addToWatch(userId, movie) {
  await dbConnect()
  const user = await User.findById(userId)
  if (!user) {
    return null
  }
  const existingMovie = user.watchList.find(
    (movieRepeat) => movieRepeat.imdbID === movie.imdbID
  )
  if (existingMovie) {
    console.log("Movie already in list:", existingMovie)
    return false
  }
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { watchList: movie } },
    { new: true }
  )
  return movie
}

export async function removeWatchMovie(userId, imdbID) {
  console.log("Movie to remove", imdbID)
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { watchList: { imdbID } } },
    { new: true }
  )
  if (!user) return null
  return true
}