import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const DEFAULT_REDIRECT_PATH = "/dashboard";

const isSafeRedirectPath = (path: unknown): path is string =>
  typeof path === "string" &&
  path.startsWith("/") &&
  !path.startsWith("//") &&
  path !== "/login" &&
  !path.startsWith("/callback");

const getStateRedirectPath = (state: unknown): unknown => {
  if (!state || typeof state !== "object" || !("redirectPath" in state)) {
    return undefined;
  }

  return (state as { redirectPath?: unknown }).redirectPath;
};

const CallbackPage: React.FC = () => {
  const { error, isLoading, isAuthenticated, signinRedirect, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      const storedRedirectPath = localStorage.getItem("redirectPath");
      localStorage.removeItem("redirectPath");
      const stateRedirectPath = getStateRedirectPath(user?.state);

      const redirectPath = isSafeRedirectPath(storedRedirectPath)
        ? storedRedirectPath
        : isSafeRedirectPath(stateRedirectPath)
          ? stateRedirectPath
          : DEFAULT_REDIRECT_PATH;

      navigate(redirectPath, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, user?.state]);

  if (isLoading) {
    return <p>Processing login...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Login could not be completed: {error.message}</p>
        <button type="button" onClick={() => signinRedirect()}>
          Try login again
        </button>
      </div>
    );
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
