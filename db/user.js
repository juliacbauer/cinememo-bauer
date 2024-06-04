import User from "./models/user";
import dbConnect from "./connection";

export async function create(username, password) {
  if (!(username && password))
    throw new Error("Must include both username and password")

  await dbConnect()

  const user = await User.create({username, password})

  if (!user)
    throw new Error("Error creating user")

  return user.toJSON()
}