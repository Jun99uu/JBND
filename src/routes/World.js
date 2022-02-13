import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BoardList from "../components/BoardList";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";

const db = getFirestore();

function World() {
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

  useEffect(async () => {
    setBoard([]);
    const docRef = collection(db, "World", worldname, "Contents");
    const q = query(docRef, orderBy("Date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
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

  return (
    <div>
      <h1>안녕하슈 여기는 {worldname}의 세상임</h1>
      <button onClick={createBtn}>작성하기</button>
      <div>
        <div>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default World;
