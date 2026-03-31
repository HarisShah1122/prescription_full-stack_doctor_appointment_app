import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isAuthenticated, isAdminAuthenticated, login, register } = useContext(AppContext);

  // Check if this is admin login based on URL
  const isAdminLogin = location.pathname === "/admin-login";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    if (state === "Sign Up" && !name) {
      toast.error("Please enter your name");
      setIsLoading(false);
      return;
    }
    
    try {
      let result;
      
      if (state === "Sign Up") {
        result = await register(name, email, password);
        if (result.success) {
          navigate("/", { replace: true });
        }
      } else {
        result = await login(email, password, isAdminLogin);
        if (result.success) {
          navigate(isAdminLogin ? "/admin-dashboard" : "/", { replace: true });
        }
      }
    } catch (err) {
      console.error("💥 Login/Signup error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {isAdminLogin ? "Admin Login" : state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>Please {isAdminLogin ? "log in as admin" : state === "Sign Up" ? "sign up" : "log in"} to {isAdminLogin ? "manage the hospital" : "book appointment"}</p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
            disabled={isLoading}
          />
        </div>

        <button 
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {state === "Sign Up" ? "Creating..." : "Logging in..."}
            </>
          ) : (
            state === "Sign Up" ? "Create account" : "Login"
          )}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
