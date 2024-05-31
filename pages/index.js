import styles from "@/styles/Home.module.css";
import Footer from "../components/Footer"
import Header from "../components/Header"

export default function Home() {
  return (
      <main>
        <Header />
        <div className={styles.main}>
          <h1>Welcome to Cinememo!</h1>
        </div>
        <Footer />
      </main>
    );
  }