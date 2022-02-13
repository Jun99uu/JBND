import CommentList from "../components/CommentList";
import MakingComment from "../components/MakingComment";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, getDoc } from "firebase/firestore";

const db = getFirestore();

function CommentRoute() {
  const { worldname, ID } = useParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user.email;
  const photoURL = user.photoURL;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState([
    {
      id: "",
      date: "",
      email: "",
      name: "",
      photo: "",
      comment: "",
    },
  ]);

  useEffect(async () => {
    const docRef = doc(db, "UserInfo", email);
    const docSnap = await getDoc(docRef);
    setName(docSnap._document.data.value.mapValue.fields.Nickname.stringValue);
  }, []);

  useEffect(async () => {
    setSaved([]);
    const docRef = doc(db, "World", worldname, "Contents", ID);
    const docSnap = await getDoc(docRef);
    try {
      const fields =
        docSnap._document.data.value.mapValue.fields.Comment.mapValue.fields;
      const getKeys = Object.keys(fields)
        .sort()
        .map((entrie, idx) => {
          // console.log(fields[entrie]);
          setSaved((prevState) => [
            ...prevState,
            {
              id: entrie,
              date: fields[entrie].arrayValue.values[0].stringValue,
              email: fields[entrie].arrayValue.values[1].stringValue,
              name: fields[entrie].arrayValue.values[2].stringValue,
              photo: fields[entrie].arrayValue.values[3].stringValue,
              comment: fields[entrie].arrayValue.values[4].stringValue,
            },
          ]);
        });
    } catch (e) {
      console.log("댓글없음");
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로가기
      </button>
      <h1>댓글</h1>
      <MakingComment
        email={email}
        name={name}
        worldname={worldname}
        ID={ID}
        photo={photoURL}
      />
      <hr />
      <div>
        {saved.map((savedObject) => (
          <CommentList
            key={savedObject.id}
            date={savedObject.date}
            email={savedObject.email}
            name={savedObject.name}
            photo={savedObject.photo}
            comment={savedObject.comment}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentRoute;
