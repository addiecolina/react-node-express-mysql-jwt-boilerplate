import AuthProvider from "../../providers/AuthProvider";
import LoginPage from "../../pages/login/LoginPage";

const HomePage = () => {
  return (
    <>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </>
  );
};

export default HomePage;
