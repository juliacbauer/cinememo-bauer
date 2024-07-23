import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.container}>
      <p>Julia Bauer © 2024</p>
      <p>OMDb API | Next.js | Vercel</p>
    </footer>
  );
}

export default Footer;