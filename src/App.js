import app from "./firebase";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "./components/NavBar";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./routes/Home";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import About from "./routes/About";
import FindWorld from "./routes/FindWorld";
import MakeWorld from "./routes/MakeWorld";
import MyProfile from "./routes/MyProfile";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogined(true);
      } else {
        setIsLogined(false);
      }
    });
  }, []);

  return (
    <Router>
      <NavBar isLogined={isLogined} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/about" element={<About />}></Route>
        <Route
          path="/findworld"
          element={
            <PrivateRoute>
              <FindWorld />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/makeworld"
          element={
            <PrivateRoute>
              <MakeWorld />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
