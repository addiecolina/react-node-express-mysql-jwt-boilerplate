import { Link } from "react-router-dom";
import Header from "../shared/Header";
import AuthProvider from "../../providers/AuthProvider";
import LoginPage from "../../pages/login/LoginPage";

const HomePage = () => {
  return (
    <>
      <AuthProvider>
        {/* <Header />
        <main
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Landing page</h1>

          <Link className="btn" to={"/admin/login"}>
            Login Page
          </Link>
          <Link className="btn" to={"/register"}>
            Create Account
          </Link>
        </main> */}
        <LoginPage />
      </AuthProvider>
    </>
  );
};

export default HomePage;
