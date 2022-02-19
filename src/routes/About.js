import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>🧑Developer Infor💻</h1>
        <hr />
        <div className={styles.inforbox}>
          🐈Git :{" "}
          <a href="https://github.com/Jun99uu" target="_blank">
            @Jun99uu
          </a>
          <br />
          ⭐Instagram :{" "}
          <a href="https://www.instagram.com/99uu_u/" target="_blank">
            @99uu_u
          </a>
          <br />
          📗Blog :{" "}
          <a href="https://blog.naver.com/igun0423" target="_blank">
            @igun0423
          </a>
        </div>
        <div>
          문의나 오류 지적
          <br className={styles.enter} />
          언제나 환영입니다💙
        </div>
      </div>
    </div>
  );
}

export default About;
