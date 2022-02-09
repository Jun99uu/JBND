import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function PrivateRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLogined, setIsLogined] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogined(true);
      } else {
        setIsLogined(false);
      }
    });
  }, []);

  if (isLogined === true) {
    return children;
  } else if (isLogined === false) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

export default PrivateRoute;
