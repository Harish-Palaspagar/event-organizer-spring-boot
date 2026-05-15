import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const DEFAULT_REDIRECT_PATH = "/dashboard";

const getLoginRedirectPath = () => {
  const redirectPath = localStorage.getItem("redirectPath");

  if (
    redirectPath &&
    redirectPath.startsWith("/") &&
    !redirectPath.startsWith("//") &&
    redirectPath !== "/login" &&
    !redirectPath.startsWith("/callback")
  ) {
    return redirectPath;
  }

  return DEFAULT_REDIRECT_PATH;
};

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const redirectPath = getLoginRedirectPath();

    if (isAuthenticated) {
      localStorage.removeItem("redirectPath");
      navigate(redirectPath, { replace: true });
      return;
    }

    if (!isAuthenticated) {
      signinRedirect({ state: { redirectPath } });
    }
  }, [isLoading, isAuthenticated, navigate, signinRedirect]);

  return <div>Redirecting to login...</div>;
};

export default LoginPage;
