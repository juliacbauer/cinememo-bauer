//import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";
import Link from "next/link";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const watch = await db.watch.getWatch(user._id)
    const props = {}
    if (user) {
      props.isLoggedIn = true
    } else {
      props.isLoggedIn = false
    }
    return {
      props: {
        user: req.session.user,
        isLoggedIn: true,
        watchList: watch,
      }
    }
  },
  sessionOptions
);

export default function Watch(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div>
          <h1>To Watch</h1>
          {props.watchList.length > 0 ? (
            <div>
              {props.watchList.map(movie => (
                <div key={movie._id}>
                  <h2>{movie.title}</h2>
                  <p>Year: {movie.year}</p>
                  <Link href={`/movie/${movie.imdbID}`}>
                      <img src={movie.poster} alt="Movie poster" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Visit the search page to start adding movies.</p>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}