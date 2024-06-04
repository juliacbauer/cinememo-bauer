import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const watched = await db.watched.getWatched(user._id);
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
        watchedList: watched,
      }
    };
  },
  sessionOptions
);

export default function Watched(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>Watched</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}