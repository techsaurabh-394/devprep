import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Optionally, fetch user profile here
      navigate("/", { replace: true }); // Redirect to home or dashboard
    } else {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-xl font-bold text-purple-700 mb-4">Logging you in...</div>
      <div className="text-gray-500">Please wait.</div>
    </div>
  );
};

export default AuthSuccess;
