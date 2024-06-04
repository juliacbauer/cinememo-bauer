import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const favorites = await db.favorites.getFavorites(user._id);
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return {
      props: {
        user: req.session.user,
        isLoggedIn: true,
        favoritesList: favorites,
      }
    };
  },
  sessionOptions
);


export default function Faves(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Faves</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}