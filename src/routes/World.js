import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import BoardList from "../components/BoardList";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import styles from "./World.module.css";

const db = getFirestore();

function World() {
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user.email;
  const { worldname } = useParams();
  const navigate = useNavigate();
  const createBtn = () => {
    navigate(`/world/${worldname}/create`);
  };
  const [board, setBoard] = useState([
    {
      id: "",
      key: "",
      date: "",
      email: "",
      name: "",
      image: "",
      posting: "",
      hashtag: "",
      like: [],
    },
  ]);
  const [code, setCode] = useState("");
  const [onCode, setOnCode] = useState(false);

  useEffect(async () => {
    const docRef = doc(db, "World", worldname);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const key = docSnap._document.data.value.mapValue.fields.Key.stringValue;
      setCode(key);
    } else {
      console.log("No such document!");
    }
  }, []);

  useEffect(async () => {
    setBoard([]);
    const docRef = collection(db, "World", worldname, "Contents");
    const q = query(docRef, orderBy("Date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setBoard((prevState) => [
        ...prevState,
        {
          key: doc.id,
          id: doc.id,
          date: doc.data().Date,
          email: doc.data().Email,
          name: doc.data().Name,
          image: doc.data().Image,
          posting: doc.data().Posting,
          hashtag: doc.data().Hashtag,
          like: doc.data().Like,
        },
      ]);
    });
  }, []);

  const secessionBtn = async () => {
    const message =
      "탈퇴를 진행한 이후 재가입을 위해선 세상코드를 다시 받아야합니다.\n탈퇴하시겠습니까?";
    if (window.confirm(message)) {
      const docRef = doc(db, "UserInfo", email);
      const worldRef = doc(db, "World", worldname);
      const docSnap = await getDoc(worldRef);
      const membernum =
        docSnap._document.data.value.mapValue.fields.Member.arrayValue.values
          .length;

      await updateDoc(docRef, {
        WorldList: arrayRemove(worldname),
      });
      if (membernum < 2) {
        await deleteDoc(doc(db, "World", worldname));
      } else {
        await updateDoc(worldRef, {
          Member: arrayRemove(email),
        });
      }

      navigate("/");
    }
  };

  const getCodeBtn = () => {
    setOnCode((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.intro}>
          어서오세요,
          <br className={styles.enter} /> {worldname}의 세상입니다✨
        </h1>
        <div className={styles.thrBtn}>
          <button onClick={createBtn} className={styles.draw}>
            작성하기
          </button>
          <button onClick={secessionBtn} className={styles.secssion}>
            탈퇴
          </button>
          <button onClick={getCodeBtn} className={styles.code}>
            세상코드
          </button>
        </div>

        {onCode ? (
          <div className={styles.viewCode}>
            세상코드를 공유해서 함께 덕질하세요!
            <br />
            {code}
          </div>
        ) : null}
        <div>
          <div className={styles.feed}>
            {board.map((boardObject) => (
              <BoardList
                worldname={worldname}
                key={boardObject.key}
                id={boardObject.id}
                date={boardObject.date}
                email={boardObject.email}
                name={boardObject.name}
                image={boardObject.image}
                posting={boardObject.posting}
                hashtag={boardObject.hashtag}
                like={boardObject.like}
                className={styles.feedbox}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default World;
