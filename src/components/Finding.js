import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Finding.module.css";

const db = getFirestore();

function Finding() {
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user.email;
  const userName = user.displayName;
  const [name, setName] = useState("");
  const [world, setWorld] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [searched, setSearch] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();

  useEffect(async () => {
    setWorld([]);
    const docRef = await getDocs(collection(db, "World"));
    if (name === "") {
      docRef.forEach((doc) => {
        setWorld((world) => [...world, doc.id]);
      });
    } else {
      docRef.forEach((doc) => {
        if (doc.id.search(name) !== -1) {
          setWorld((world) => [...world, doc.id]);
        }
      });
    }
  }, []);

  const searchName = async () => {
    setWorld([]);
    const docRef = await getDocs(collection(db, "World"));
    if (name === "") {
      docRef.forEach((doc) => {
        setWorld((world) => [...world, doc.id]);
      });
    } else {
      docRef.forEach((doc) => {
        if (doc.id.search(name) !== -1) {
          setWorld((world) => [...world, doc.id]);
        }
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    searchName();
  };

  const onChangeHandler = (e) => {
    setName(e.target.value);
  };

  const selectWorld = (name, e) => {
    // console.log(name);
    setCode("");
    setHidden(true);
    setSearch(name);
  };

  const codeChange = (e) => {
    setCode(e.target.value);
  };

  const codeSubmit = async () => {
    const docRef = doc(db, "World", searched);
    const docSnap = await getDoc(docRef);
    const worldKey =
      docSnap._document.data.value.mapValue.fields.Key.stringValue;
    if (code === worldKey) {
      try {
        await updateDoc(docRef, {
          Member: arrayUnion(email),
        });
        setError("");
        navigate("/profile");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      setError("????????? ?????? ??????????????????????");
    }
  };

  const registerworld = async (e) => {
    e.preventDefault();
    try {
      const DocRef = doc(db, "UserInfo", email);
      const docSnap = await getDoc(DocRef);
      const worldlist =
        docSnap._document.data.value.mapValue.fields.WorldList.arrayValue;
      if (Number(worldlist.values.length) < 3) {
        await updateDoc(DocRef, { WorldList: arrayUnion(searched) });
        codeSubmit();
      } else {
        setError("3??? ????????? ???????????? ?????? ??? ?????????????");
      }
    } catch (e) {
      try {
        const DocRef = doc(db, "UserInfo", email);
        await updateDoc(DocRef, { WorldList: arrayUnion(searched) });
        codeSubmit();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const closeHandler = () => {
    setHidden(false);
    setCode("");
    setError("");
  };

  return (
    <div className={styles.box}>
      <div className={styles.firstbox}>
        <h2>
          ????????? ????????? ??????,
          <br className={styles.enter} /> ?????? ??????????????????!
        </h2>
      </div>
      <div className={styles.secondbox}>
        <div className={styles.finding}>
          <form onSubmit={submitHandler}>
            <input
              placeholder="?????? ?????? ????????? ??????????????????."
              type="text"
              value={name}
              onChange={onChangeHandler}
            />
            <button className={styles.findBtn}>??????</button>
          </form>
          {world.map((worldname) => (
            <div key={worldname} className={styles.findingList}>
              <button
                onClick={(e) => {
                  selectWorld(worldname, e);
                }}
              >{`?????? ${worldname}?????? ??????`}</button>
            </div>
          ))}
        </div>

        {hidden ? (
          <div className={styles.registerWorld}>
            <h2>?????? {searched}?????? ?????? ????????????</h2>
            <form onSubmit={registerworld}>
              <input
                type="text"
                placeholder="?????? ????????? ??????????????????."
                required
                onChange={codeChange}
                value={code}
              />
              {errorMsg !== "" ? <h4>{errorMsg}</h4> : null}
            </form>
            <button onClick={registerworld} className={styles.complete}>
              ??????
            </button>
            <button onClick={closeHandler} className={styles.close}>
              ??????
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Finding;
