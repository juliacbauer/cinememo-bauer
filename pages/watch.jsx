import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const watch = await db.watch.getWatch(user._id);
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
        watchList: watch,
      }
    };
  },
  sessionOptions
);
export default function Watch(props) {
  return (
    <>
      <main>
        <Header isLoggedIn={props.isLoggedIn} />
        <div className={styles.main}>
          <h1>To Watch</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}