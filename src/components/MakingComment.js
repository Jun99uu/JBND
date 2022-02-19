import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import styles from "./MakingComment.module.css";

const db = getFirestore();

function MakingComment({ email, name, worldname, ID, photo }) {
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const updateDate = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = today.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let hours = today.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = today.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let seconds = today.getSeconds();
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    let todate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    setDate(todate);
  };

  const commentHandler = (e) => {
    setComment(e.target.value);
  };

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    updateDate();
  };

  useEffect(async () => {
    if (date !== "") {
      const random = `${date}${uuidv4()}`;
      const DocRef = doc(db, "World", worldname, "Contents", ID);
      await setDoc(
        DocRef,
        { Comment: { [random]: [date, email, name, photo, comment] } },
        { merge: true }
      );
      setComment("");
      navigate(0);
    }
  }, [date]);

  return (
    <div className={styles.box}>
      <h4>{name}</h4>
      <form onSubmit={commentSubmitHandler}>
        <input
          placeholder="댓글을 작성해주세요."
          type="text"
          required
          onChange={commentHandler}
          value={comment}
        />
        <button>완료</button>
      </form>
    </div>
  );
}

export default MakingComment;
