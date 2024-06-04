import User from "../models/user";
import dbConnect from "../connection";

export async function getFavorites(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  console.log(user.favoritesList)
  if (!user) return null
  return JSON.parse(JSON.stringify(user.favoritesList))
}