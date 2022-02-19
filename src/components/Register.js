import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import styles from "./Register.module.css";

const db = getFirestore();

function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorDisplay, setError] = useState(null);
  let navigate = useNavigate();
  const auth = getAuth();

  const signup = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "gs://it-salltoyou.appspot.com/Designer.png",
      })
        .then(async () => {
          try {
            await setDoc(doc(db, "UserInfo", email), {
              Age: age,
              Nickname: nickname,
              WorldList: [],
            });
          } catch (e) {}

          // Profile updated!
          // ...
        })
        .catch((error) => {
          console.log("failed");
          // An error occurred
          // ...
        });
      navigate("/");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setError("비밀번호는 6자리 이상으로 설정해주세요😊");
      } else if (error.code === "auth/email-already-in-use") {
        setError("이미 존재하는 이메일이에요😎");
      } else {
        setError("회원가입에 실패했어요😢");
      }
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    signup();
  };

  const handleOnChange = (e) => {
    const type = e.target.name;
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    } else if (type === "name") {
      setName(e.target.value);
    } else if (type === "age") {
      setAge(e.target.value);
    } else if (type === "nickname") {
      setNickname(e.target.value);
    }
  };

  return (
    <div className={styles.box}>
      <h2>
        전부 네 덕인 세상을
        <br className={styles.enter} />
        만들어보세요!
      </h2>
      <form onSubmit={handleOnSubmit}>
        <input
          name="name"
          placeholder="이름을 입력해주세요."
          type="name"
          required
          onChange={handleOnChange}
          value={name}
        />
        <br />
        <input
          name="age"
          placeholder="나이를 입력해주세요."
          type="number"
          required
          onChange={handleOnChange}
          value={age}
        />
        <br />
        <input
          name="email"
          placeholder="이메일을 입력해주세요."
          type="email"
          required
          onChange={handleOnChange}
          value={email}
        />
        <br />
        <input
          name="password"
          placeholder="비밀번호를 입력해주세요."
          type="password"
          required
          onChange={handleOnChange}
          value={password}
        />
        <br />
        <input
          name="nickname"
          placeholder="닉네임을 설정해주세요."
          type="nickname"
          required
          onChange={handleOnChange}
          value={nickname}
        />
        {errorDisplay === null ? null : <div>{errorDisplay}</div>}
        <br />
        <button className={styles.complete}>완료</button>
      </form>
    </div>
  );
}

export default Register;
