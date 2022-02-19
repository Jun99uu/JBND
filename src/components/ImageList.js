import duck1 from "../img/duck1.jpg";
import duck2 from "../img/duck2.png";
import duck3 from "../img/duck3.jfif";
import duck4 from "../img/duck4.jpg";
import duck5 from "../img/duck5.jfif";
import duck6 from "../img/duck6.jpg";
import { useState, useEffect } from "react";
import styles from "./ImageList.module.css";

function ImageList() {
  const [imgNum, setImgNum] = useState(0);
  const imgList = [duck1, duck2, duck3, duck4, duck5, duck6];
  const [duckImg, setDuck] = useState(imgList[0]);

  const handleImg = () => {
    setImgNum((prevState) => (prevState < 5 ? prevState + 1 : 0));
  };

  useEffect(() => {
    setInterval(() => handleImg(), 3000);
  }, []);

  useEffect(() => {
    setDuck(imgList[imgNum]);
  }, [imgNum]);

  return (
    <div>
      <img
        className={styles.imglist}
        src={duckImg}
        alt="duckImg"
        height="300px"
      />
    </div>
  );
}

export default ImageList;
