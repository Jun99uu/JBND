import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const db = getFirestore();
const storage = getStorage();

function MyProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const name = user.displayName;
  const uid = user.uid;
  const email = user.email;
  const photo = user.photoURL;
  const [age, setAge] = useState("");
  const [nickname, setNickname] = useState("");
  const [prevPhoto, setPhoto] = useState("");
  const [world, setWorld] = useState([]);

  const docRef = doc(db, "UserInfo", email);

  useEffect(async () => {
    const docSnap = await getDoc(docRef);
    setAge(docSnap._document.data.value.mapValue.fields.Age.stringValue);
    setNickname(
      docSnap._document.data.value.mapValue.fields.Nickname.stringValue
    );
  }, []);

  useEffect(async () => {
    setWorld([]);
    const docSnap = await getDoc(docRef);
    const savedWorld =
      docSnap._document.data.value.mapValue.fields.WorldList.arrayValue.values;
    if (savedWorld) {
      for (var i in savedWorld) {
        setWorld((world) => [...world, savedWorld[i].stringValue]);
      }
    }
  }, []);

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

        setPhoto(url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }, []);

  const [profile, setProfile] = useState("");
  const [attachment, setAttachment] = useState();

  const handleOnChange = (e) => {
    const {
      target: { files, value },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    setProfile(value);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onSaveImg = (e) => {
    e.preventDefault();
    const randomName = `${uid}/${uuidv4()}`;
    const storageRef = ref(storage, randomName);
    if (attachment !== "") {
      uploadString(storageRef, attachment, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
        updateProfile(auth.currentUser, {
          photoURL: randomName,
        })
          .then(() => {
            if (photo !== "gs://it-salltoyou.appspot.com/Designer.png") {
              const desertRef = ref(storage, photo);
              deleteObject(desertRef)
                .then(() => {
                  console.log("delete completed");
                })
                .catch((error) => {});
            }
          })
          .catch((error) => {});
      });
    }
  };

  return (
    <div>
      <h1>{name}님의 프로필이에요</h1>
      <form onSubmit={onSaveImg}>
        {attachment ? (
          <img src={attachment} width="100px" height="100px" />
        ) : (
          <img src={prevPhoto} width="100px" height="100px" />
        )}
        <br />
        <input
          name="file"
          type="file"
          accept="image/*"
          onChange={handleOnChange}
          value={profile}
        />
        <br />
        <button>저장</button>
      </form>
      <h2>
        나이 : {age}
        <br />
        닉네임 : {nickname}
      </h2>
      <h3>소속된 세상 리스트</h3>
      {world.length === 0 ? (
        <h4>아직 소속된 세상이 없네요😢</h4>
      ) : (
        world.map((worldname) => (
          <div key={worldname}>
            <Link to={`/world/${worldname}`}>
              <button>{`전부 ${worldname}덕인 세상`}</button>
            </Link>

            <br />
          </div>
        ))
      )}
    </div>
  );
}

export default MyProfile;
