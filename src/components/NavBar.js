import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function NavBar({ isLogined }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const logOut = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <ul>
        <Link to="/">
          <li>홈</li>
        </Link>
        <Link to="/about">
          <li>상세정보</li>
        </Link>

        <Link to="/makeworld">
          <li>세상만들기</li>
        </Link>

        <Link to="/findworld">
          <li>세상찾기</li>
        </Link>

        {isLogined ? (
          <div>
            <Link to="/profile">
              <li>프로필</li>
            </Link>
            <li onClick={logOut}>로그아웃</li>
          </div>
        ) : (
          <Link to="/login">
            <li>로그인</li>
          </Link>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
