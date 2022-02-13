import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

function CommentList({ date, email, name, photo, comment }) {
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;
  const authEmail = user.email;
  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(6, 2);
  const hour = date.substr(8, 2);
  const min = date.substr(10, 2);
  const [profile, setProfile] = useState("");

  useEffect(async () => {
    await getDownloadURL(ref(storage, photo))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        setProfile(url);
      })
      .catch((error) => {});
  }, []);

  return (
    <div>
      <h4>
        <img src={profile} width="40px" height="40px" />
        {name}
      </h4>
      <h5>
        {year}년 {month}월 {day}일 {hour}시 {min}분
      </h5>
      <p>{comment}</p>
      {authEmail === email ? (
        <div>
          <button>수정</button>
          <button>삭제</button>
        </div>
      ) : null}
    </div>
  );
}

export default CommentList;
