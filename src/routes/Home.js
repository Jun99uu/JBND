import ImageList from "../components/ImageList";
import WorldList from "../components/WorldList";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.firstbox}>
        <div className={styles.aboutbox}>
          <h1>'전부네덕'</h1>
          <h2>
            "네 덕에 내가 산다!"
            <br />한 명쯤 있잖아요, 그런 사람😉
          </h2>
        </div>
      </div>
      <div className={styles.firstbox}>
        <ImageList className={styles.imglist} />
      </div>
      <div className={styles.secondbox}>
        <div className={styles.makebox}>
          <h1>
            "너만을 위한 세상이 없다면,
            <br />
            그냥 만들게 내가!"
          </h1>
          <h3>전부 네 덕인 세상을 만들어보세요.</h3>
        </div>

        <button
          onClick={() => {
            navigate("/makeworld");
          }}
          className={styles.makebtn}
        >
          🌍
        </button>
      </div>
      <div className={styles.thirdbox}>
        <div className={styles.worldbtn}>
          <h2>생성된 덕후 세상들</h2>
        </div>
      </div>
      <div className={styles.worldlist}>
        <WorldList />
      </div>
    </div>
  );
}

export default Home;
