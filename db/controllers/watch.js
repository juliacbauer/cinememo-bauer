import User from "../models/user";
import dbConnect from "../connection";

export async function getWatch(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  console.log(user.watchList)
  if (!user) return null
  return JSON.parse(JSON.stringify(user.watchList))
}