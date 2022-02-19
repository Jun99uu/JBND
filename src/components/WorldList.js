import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import styles from "./WorldList.module.css";

const db = getFirestore();

function WorldList() {
  const [worldList, setWorld] = useState([]);
  useEffect(async () => {
    setWorld([]);
    const querySnapshot = await getDocs(collection(db, "World"));
    querySnapshot.forEach((doc) => {
      setWorld((prevState) => [...prevState, doc.id]);
    });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.worldbox}>
        {worldList.map((world) => (
          <div className={styles.world} key={world}>
            전부 {world}덕인 세상 🌍
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldList;
