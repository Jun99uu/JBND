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
      setError("코드를 다시 확인해주세요😢");
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
        setError("3개 이상의 세상에는 속할 수 없어요😢");
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
    <div>
      <form onSubmit={submitHandler}>
        <input
          placeholder="찾고 싶은 세상을 입력해주세요."
          type="text"
          value={name}
          onChange={onChangeHandler}
        />
        <button>찾기</button>
      </form>
      {world.map((worldname) => (
        <div key={worldname}>
          <button
            onClick={(e) => {
              selectWorld(worldname, e);
            }}
          >{`전부 ${worldname}덕인 세상`}</button>
        </div>
      ))}
      {hidden ? (
        <div>
          <h2>전부 {searched}덕인 세상 가입하기</h2>
          <form onSubmit={registerworld}>
            <input
              type="text"
              placeholder="세상 코드를 입력해주세요."
              required
              onChange={codeChange}
              value={code}
            />
            {errorMsg !== "" ? <h3>{errorMsg}</h3> : null}
            <button>가입하기</button>
          </form>
          <button onClick={closeHandler}>닫기</button>
        </div>
      ) : null}
    </div>
  );
}

export default Finding;
