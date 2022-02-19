import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getFirestore,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import styles from "./BoardList.module.css";

const db = getFirestore();

function BoardList({
  id,
  worldname,
  date,
  email,
  name,
  image,
  posting,
  hashtag,
  like,
}) {
  const auth = getAuth();
  const user = auth.currentUser;
  const myID = user.email;
  const [photo, setPhoth] = useState("");
  const [likeit, setLike] = useState("🤍");
  const [likeNum, setLikeNum] = useState(like.length);
  const [btnLock, setLock] = useState(false);
  const [modify, setModify] = useState(false);
  const [modibtn, setModiBtn] = useState("수정");
  const [modiPosting, setModiPost] = useState(posting);
  const navigate = useNavigate();

  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(6, 2);
  const hour = date.substr(8, 2);
  const min = date.substr(10, 2);

  const storage = getStorage();

  useEffect(async () => {
    await getDownloadURL(ref(storage, image))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
        setPhoth(url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }, []);

  const likeHandler = () => {
    setLock(true);
    if (likeit === "🤍") {
      setLike("💙");
    } else if (likeit === "💙") {
      setLike("🤍");
    }
  };

  useEffect(async () => {
    try {
      const DocRef = doc(db, "World", worldname, "Contents", id);
      if (likeit === "💙") {
        await updateDoc(DocRef, {
          Like: arrayUnion(myID),
        });
      } else if (likeit === "🤍") {
        await updateDoc(DocRef, {
          Like: arrayRemove(myID),
        });
      }
    } catch (e) {}
  }, [likeit]);

  useEffect(async () => {
    try {
      const DocRef = doc(db, "World", worldname, "Contents", id);
      const docSnap = await getDoc(DocRef);
      setLikeNum(
        docSnap._document.data.value.mapValue.fields.Like.arrayValue.values
          .length
      );
      setLock(false);
    } catch (e) {
      setLock(false);
    }
  }, [likeit]);

  useEffect(() => {
    if (like.indexOf(myID) !== -1) {
      setLike("💙");
    }
  }, []);

  const deleteHandler = async () => {
    const message =
      "게시물을 삭제한 후에는 복구할 수 없습니다.\n삭제하시겠습니까?";
    if (window.confirm(message)) {
      const DocRef = doc(db, "World", worldname, "Contents", id);
      const imgRef = ref(storage, image);
      await deleteDoc(DocRef);
      await deleteObject(imgRef);

      navigate(0);
    }
  };

  const modifyHandler = async (e) => {
    setModify((prevState) => !prevState);
    setModiBtn((prevState) => (prevState === "수정" ? "수정완료" : "수정"));
    if (modibtn === "수정완료") {
      const message =
        "게시물을 수정한 후에는 복구할 수 없습니다.\n수정하시겠습니까?";
      if (window.confirm(message)) {
        const DocRef = doc(db, "World", worldname, "Contents", id);
        try {
          await setDoc(DocRef, { Posting: modiPosting }, { merge: true });
          navigate(0);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const postingHandler = (e) => {
    setModiPost(e.target.value);
  };

  return (
    <div className={styles.box}>
      <div className={styles.name}>{name}</div>
      <div className={styles.date}>
        {year}년 {month}월 {day}일 {hour}시 {min}분
      </div>

      {email === myID ? (
        <div className={styles.twoBtn}>
          <button onClick={modifyHandler} className={styles.modi}>
            {modibtn}
          </button>
          <button onClick={deleteHandler} className={styles.delete}>
            삭제
          </button>
        </div>
      ) : null}

      <img src={photo} className={styles.photo} />

      <div className={styles.posting}>
        <div className={styles.upper}>
          <div className={styles.hashtag}>#{hashtag}</div>
          <div className={styles.like}>
            <button onClick={likeHandler} disabled={btnLock}>
              {likeit}
            </button>
            <div className={styles.likenum}>{likeNum}</div>

            <Link to={`/world/${worldname}/${id}`} className={styles.comment}>
              <button>📢</button>
            </Link>
          </div>
        </div>

        {modify ? (
          <div className={styles.modiPost}>
            <input
              placeholder="수정할 내용을 입력해주세요."
              value={modiPosting}
              onChange={postingHandler}
            />
          </div>
        ) : (
          <div className={styles.post}>{posting}</div>
        )}
      </div>
    </div>
  );
}

export default BoardList;
