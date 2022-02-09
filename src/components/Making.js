import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore();

function Making() {
  const auth = getAuth();
  const user = auth.currentUser;
  const userName = user.displayName;
  const userEmail = user.email;
  const email = [user.email];
  const Member = "Member";
  const [emotion, setEmotion] = useState("좋아");
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const navigate = useNavigate();

  const emotionHandler = (radio) => {
    setEmotion(radio);
  };

  const nameHandler = (e) => {
    setName(e.target.value);
  };

  const makeworld = async () => {
    try {
      const DocRef = doc(db, "World", name);
      const docSnap = await getDoc(DocRef);
      if (docSnap.exists()) {
        setError("이미 있는 세상이네요😢");
      } else {
        await setDoc(
          DocRef,
          { Key: uuidv4(), [Member]: email, Emotion: emotion },
          { merge: true }
        );
        setError();
        navigate("/profile");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const registerworld = async () => {
    try {
      const DocRef = doc(db, "UserInfo", userEmail);
      const docSnap = await getDoc(DocRef);
      const worldlist =
        docSnap._document.data.value.mapValue.fields.WorldList.arrayValue;
      if (Number(worldlist.values.length) < 3) {
        await updateDoc(DocRef, { WorldList: arrayUnion(name) });
        makeworld();
      } else {
        setError("3개 이상의 세상에는 속할 수 없어요😢");
      }
    } catch (e) {
      try {
        const DocRef = doc(db, "UserInfo", userEmail);
        await updateDoc(DocRef, { WorldList: arrayUnion(name) });
        makeworld();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  //   const tmpworld = async () => {
  //     const DocRef = doc(db, "World", name);
  //     try {
  //       await updateDoc(DocRef, {
  //         Member: arrayUnion(`${uuidv4()}`),
  //       });
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  //   };

  const submitHandler = (e) => {
    e.preventDefault();
    registerworld();
  };

  return (
    <div>
      <h1>당신의 세상을 만들어보세요!</h1>
      <h4>최대 3개의 세상에만 속할 수 있어요.</h4>
      <hr />

      <form onSubmit={submitHandler}>
        <h1>전부 '{name}'덕인 세상🌍</h1>
        <h3>당신이 만드려는 세상, 전부 누구덕인 세상인가요?</h3>
        <input
          placeholder="내 세상의 주인, 이름을 작성해주세요!"
          type="text"
          required
          value={name}
          onChange={nameHandler}
        />
        <h2>당신은 당신의 세상을…</h2>
        <input
          type="radio"
          readOnly
          id="사랑"
          checked={emotion === "사랑"}
          onClick={() => emotionHandler("사랑")}
        />
        <label htmlFor="사랑">사랑해요💛</label>

        <input
          type="radio"
          id="좋아"
          readOnly
          checked={emotion === "좋아"}
          onClick={() => emotionHandler("좋아")}
        />
        <label htmlFor="좋아">좋아해요😉</label>

        <input
          type="radio"
          id="팬"
          readOnly
          checked={emotion === "팬"}
          onClick={() => emotionHandler("팬")}
        />
        <label htmlFor="팬">팬이에요😍</label>

        <input
          type="radio"
          id="미워"
          readOnly
          checked={emotion === "미워"}
          onClick={() => emotionHandler("미워")}
        />
        <label htmlFor="미워">미운정이 무서워요😎</label>
        <br />
        <button>만들기</button>
      </form>
      {error ? <h4>{error}</h4> : null}
    </div>
  );
}

export default Making;
