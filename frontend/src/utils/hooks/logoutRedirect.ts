import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import { convertToRoleData } from "../globals";

export const useLogoutRedirect = () => {
  // const location = useLocation();
  const navigate = useNavigate();

  return useCallback(() => {
    // const urlSlug =
    //   location.pathname.split("/") && location.pathname.split("/")[1]
    //     ? location.pathname.split("/")[1]
    //     : "";

    // const redirectUrl = "/" + convertToRoleData(urlSlug, "string") + "/login";

    // if (redirectUrl && location.pathname !== redirectUrl) {
      navigate("/", { replace: true });
    // }
  }, [navigate]);
};
