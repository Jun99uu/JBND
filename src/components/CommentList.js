import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CommentList.module.css";

const db = getFirestore();

function CommentList({
  worldname,
  ID,
  commentID,
  date,
  email,
  name,
  photo,
  comment,
}) {
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;
  const authEmail = user.email;
  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(6, 2);
  const hour = date.substr(8, 2);
  const min = date.substr(10, 2);
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();
  const [modify, setModify] = useState(false);
  const [modiBtn, setModiBtn] = useState("수정");
  const [modiComment, setModiComment] = useState(comment);

  useEffect(async () => {
    await getDownloadURL(ref(storage, photo))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        setProfile(url);
      })
      .catch((error) => {});
  }, []);

  const deleteHandler = async () => {
    const message =
      "댓글을 삭제한 후에는 복구할 수 없습니다.\n삭제하시겠습니까?";
    if (window.confirm(message)) {
      const docRef = doc(db, "World", worldname, "Contents", ID);
      const docSnap = await getDoc(docRef);
      try {
        const fields =
          docSnap._document.data.value.mapValue.fields.Comment.mapValue.fields;
        await updateDoc(docRef, { Comment: deleteField() });
        const getKeys = Object.keys(fields).map(async (entrie, idx) => {
          if (entrie !== commentID) {
            let date = fields[entrie].arrayValue.values[0].stringValue;
            let email = fields[entrie].arrayValue.values[1].stringValue;
            let name = fields[entrie].arrayValue.values[2].stringValue;
            let photo = fields[entrie].arrayValue.values[3].stringValue;
            let comment = fields[entrie].arrayValue.values[4].stringValue;
            await setDoc(
              docRef,
              { Comment: { [entrie]: [date, email, name, photo, comment] } },
              { merge: true }
            );
          }
        });
      } catch (e) {
        console.log("댓글없음");
      }
      navigate(0);
    }
  };

  const modifyHandler = async () => {
    setModify((prevState) => !prevState);
    setModiBtn((prevState) => (prevState === "수정" ? "수정완료" : "수정"));
    if (modiBtn === "수정완료") {
      if (comment !== modiComment) {
        const message =
          "댓글은 수정한 후에는 복구할 수 없습니다.\n수정하시겠습니까?";
        if (window.confirm(message)) {
          const DocRef = doc(db, "World", worldname, "Contents", ID);
          await setDoc(
            DocRef,
            {
              Comment: { [commentID]: [date, email, name, photo, modiComment] },
            },
            { merge: true }
          );
          navigate(0);
        }
      }
    }
  };

  const commentHandler = (e) => {
    setModiComment(e.target.value);
  };

  return (
    <div className={styles.box}>
      <div className={styles.profile}>
        <img src={profile} width="40px" height="40px" />
        <div className={styles.infor}>
          <h4>{name}</h4>
          <h5>
            {year}년 {month}월 {day}일 {hour}시 {min}분
          </h5>
        </div>
      </div>
      {modify ? (
        <input
          placeholder="수정할 내용을 입력해주세요."
          value={modiComment}
          onChange={commentHandler}
          className={styles.modiCom}
        />
      ) : (
        <div className={styles.comment}>{comment}</div>
      )}
      {authEmail === email ? (
        <div className={styles.twoBtn}>
          <button onClick={modifyHandler} className={styles.modiBtn}>
            {modiBtn}
          </button>
          <button onClick={deleteHandler} className={styles.deleteBtn}>
            삭제
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default CommentList;
