import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import logo from "../img/logo.png";
import styles from "./NavBar.module.css";

function NavBar({ isLogined }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isClick, setClick] = useState(false);

  const logOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onClick = () => {
    setClick((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoImg}>
        <Link to="/">
          <img src={logo} alt="logo" className={styles.logo} />
        </Link>
      </div>
      <div className={isClick ? styles.mainMenuactive : styles.mainMenu}>
        <ul>
          <li>
            <Link to="/about" className={styles.link}>
              About
            </Link>
          </li>

          <li>
            <Link to="/makeworld" className={styles.link}>
              Make World
            </Link>
          </li>

          <li>
            <Link to="/findworld" className={styles.link}>
              Find World
            </Link>
          </li>
        </ul>
      </div>
      {isLogined ? (
        <div className={isClick ? styles.signMenuactive : styles.signMenu}>
          <ul>
            <li>
              <Link to="/profile" className={styles.link}>
                Profile
              </Link>
            </li>

            <li>
              <Link to="" className={styles.link} onClick={logOut}>
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className={isClick ? styles.signMenuactive : styles.signMenu}>
          <ul>
            <li>
              <Link to="/login" className={styles.link}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
      <Link to="#" className={styles.navbar_togleBtn} onClick={onClick}>
        📁
      </Link>
    </div>
  );
}

export default NavBar;
