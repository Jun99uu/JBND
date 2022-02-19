import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorDisplay, setError] = useState(null);
  let navigate = useNavigate();

  const auth = getAuth();

  const signIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("비밀번호가 틀렸어요😢");
      } else if (error.code === "auth/user-not-found") {
        setError("이메일이 잘못됐거나, 없는 계정이에요😢");
      } else {
        setError("로그인 오류에요😢");
      }
    }
  };

  const onChangeHandler = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    signIn();
  };

  const onClickHandler = (e) => {
    navigate("/register");
  };

  return (
    <div className={styles.box}>
      <h2>
        전부 네 덕인 세상을
        <br className={styles.enter} />
        만들어보세요!
      </h2>
      <form onSubmit={onSubmitHandler}>
        <input
          placeholder="Email"
          type="email"
          name="email"
          required
          onChange={onChangeHandler}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          name="password"
          required
          onChange={onChangeHandler}
        />
        {errorDisplay === null ? null : <div>{errorDisplay}</div>}
        <br />
        <button className={styles.loginbtn}>완료</button>
        <button onClick={onClickHandler} className={styles.signupbtn}>
          가입
        </button>
      </form>
    </div>
  );
}

export default Login;
