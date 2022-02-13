import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadString } from "firebase/storage";
import { doc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore();

function CreatePost() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const email = user.email;
  const { worldname } = useParams();
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [posting, setPosting] = useState("");
  const [hashtag, setHash] = useState("");
  const [attachment, setAttachment] = useState();
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

  useEffect(async () => {
    const docRef = doc(db, "UserInfo", email);
    const docSnap = await getDoc(docRef);
    setName(docSnap._document.data.value.mapValue.fields.Nickname.stringValue);
  }, []);

  const handleOnChange = (e) => {
    const {
      target: { files, value },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    setImage(value);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const postingChange = (e) => {
    setPosting(e.target.value);
  };

  const tagHandler = (radio) => {
    setHash(radio);
    updateDate();
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const imageRoute = `${worldname}/${uuidv4()}`;
    const storage = getStorage();
    const DocRef = doc(
      db,
      "World",
      worldname,
      "Contents",
      `${date}-${uuidv4()}`
    );
    const storageRef = ref(storage, imageRoute);
    if (attachment !== "") {
      uploadString(storageRef, attachment, "data_url").then((snapshot) => {
        setDoc(
          DocRef,
          {
            Email: email,
            Name: name,
            Date: date,
            Image: imageRoute,
            Like: [],
            Posting: posting,
            Hashtag: hashtag,
            Comment: {},
          },
          { merge: true }
        );
        navigate(`/world/${worldname}`);
      });
    }
  };

  return (
    <div>
      <h1>우리 {worldname}…</h1>
      <form onSubmit={onSubmitHandler}>
        <img src={attachment} width="300px" height="300px" />
        <br />
        <input
          name="file"
          type="file"
          accept="image/*"
          onChange={handleOnChange}
          value={image}
          required
        />
        <br />

        <input
          placeholder="내용을 작성해주세요"
          required
          type="text"
          onChange={postingChange}
        />
        <br />

        <input
          type="radio"
          readOnly
          id="귀여워"
          checked={hashtag === "귀여워"}
          onClick={() => tagHandler("귀여워")}
        />
        <label htmlFor="귀여워">#귀여워💘</label>

        <input
          type="radio"
          id="잘생겼어"
          readOnly
          checked={hashtag === "잘생겼어"}
          onClick={() => tagHandler("잘생겼어")}
        />
        <label htmlFor="잘생겼어">#잘생겼어🤤</label>

        <input
          type="radio"
          id="예뻐"
          readOnly
          checked={hashtag === "예뻐"}
          onClick={() => tagHandler("예뻐")}
        />
        <label htmlFor="예뻐">#예뻐😍</label>

        <input
          type="radio"
          id="사랑해"
          readOnly
          checked={hashtag === "사랑해"}
          onClick={() => tagHandler("사랑해")}
        />
        <label htmlFor="사랑해">#사랑해😘</label>

        <input
          type="radio"
          id="개웃겨"
          readOnly
          checked={hashtag === "개웃겨"}
          onClick={() => tagHandler("개웃겨")}
        />
        <label htmlFor="개웃겨">#개웃겨😆</label>
        <br />
        <button>완료</button>
      </form>
    </div>
  );
}

export default CreatePost;
