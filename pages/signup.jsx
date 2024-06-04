import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Signup() {
  return (
    <>
      <main>
        <Header />
        <div className={styles.main}>
          <h1>Sign up</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}