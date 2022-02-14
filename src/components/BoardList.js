import { getStorage, ref, getDownloadURL } from "firebase/storage";
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
    const DocRef = doc(db, "World", worldname, "Contents", id);
    const message =
      "게시물을 삭제한 후에는 복구할 수 없습니다.\n삭제하시겠습니까?";
    if (window.confirm(message)) {
      await deleteDoc(DocRef);
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
    <div>
      <div>
        {year}년 {month}월 {day}일 {hour}시 {min}분
      </div>
      <div>{name}</div>
      {email === myID ? (
        <div>
          <button onClick={modifyHandler}>{modibtn}</button>
          <button onClick={deleteHandler}>삭제</button>
        </div>
      ) : null}
      <img src={photo} width="300px" height="300px" />
      <div>#{hashtag}</div>
      {modify ? (
        <div>
          <input
            placeholder="수정할 내용을 입력해주세요."
            value={modiPosting}
            onChange={postingHandler}
          />
        </div>
      ) : (
        <div>{posting}</div>
      )}
      <button onClick={likeHandler} disabled={btnLock}>
        {likeit}
      </button>
      <div>좋아요 {likeNum}개</div>
      <Link to={`/world/${worldname}/${id}`}>
        <button>🗨</button>
      </Link>
    </div>
  );
}

export default BoardList;
