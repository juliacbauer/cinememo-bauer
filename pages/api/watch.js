import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from "../../db";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    console.log(req.session)
    if (!req.session.user) {
      return res.status(401).end()
    }
    const { _id: userId } = req.session.user
    switch (req.method) {
      case "POST":
        try {
          const movie = req.body
          const addedMovie = await db.watch.addToWatch(userId, movie)
          console.log("Added:", addedMovie)
          return res.status(200).json({ movie: addedMovie, message: "Movie added" })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      case "DELETE":
        try {
          const { imdbID } = req.body
          console.log("Movie for remove", imdbID)
          const deletedMovie = await db.watch.removeWatchMovie(userId, imdbID)
          if (deletedMovie === null) {
            req.session.destroy()
            return res.status(401).end()
          }
          return res.status(200).json({ movie: deletedMovie })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      default:
        return res.status(404).end()
    }
  },
  sessionOptions
)