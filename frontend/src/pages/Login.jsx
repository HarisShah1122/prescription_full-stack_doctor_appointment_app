import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, token, setToken } = useContext(AppContext);

  // Check if this is admin login based on URL
  const isAdminLogin = location.pathname === "/admin-login";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await api.post('/api/user/register', {
          name,
          email,
          password,
        });

        if (data.success) {
          // Cookie will be set automatically by backend
          // Keep localStorage for backward compatibility
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
          navigate(isAdminLogin ? "/admin-dashboard" : "/");
        } else toast.error(data.message);
      } else {
        // Check if this is admin login
        if (isAdminLogin) {
          const { data } = await api.post('/api/admin/login', {
            email,
            password,
          });

          if (data.success) {
            // Cookie will be set automatically by backend
            // Keep localStorage for backward compatibility
            localStorage.setItem("aToken", data.token);
            toast.success("Admin login successful!");
            navigate("/admin-dashboard");
          } else toast.error(data.message);
        } else {
          const { data } = await api.post('/api/user/login', {
            email,
            password,
          });

          if (data.success) {
            // Cookie will be set automatically by backend
            // Keep localStorage for backward compatibility
            localStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Login successful!");
            navigate("/");
          } else toast.error(data.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error — check console for details.");
    }
  };

  useEffect(() => {
    if (token && !isAdminLogin) navigate("/");
    if (localStorage.getItem("aToken") && isAdminLogin) navigate("/admin-dashboard");
  }, [token, isAdminLogin]);

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
          />
        </div>

        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          {state === "Sign Up" ? "Create account" : "Login"}
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
