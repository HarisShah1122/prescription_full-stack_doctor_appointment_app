import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
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
    console.log('🔘 Form submitted - State:', state);
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('🔐 Password length:', password?.length);
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (state === "Sign Up" && !name) {
      toast.error("Please enter your name");
      return;
    }
    
    try {
      if (state === "Sign Up") {
        console.log('📝 Attempting signup...');
        // Fix: Use withCredentials for cookies
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        }, {
          withCredentials: true, // Important for cookies
        });

        console.log('📋 Signup response:', data);

        if (data.success) {
          // Handle new response format
          const userToken = data.data?.token || data.token;
          const userData = data.data?.user;
          
          if (userToken) {
            localStorage.setItem("token", userToken);
            setToken(userToken);
          }
          
          // Store user data if available
          if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
          }
          
          toast.success("Account created successfully!");
          navigate(isAdminLogin ? "/admin-dashboard" : "/");
        } else {
          console.error('❌ Signup failed:', data.message);
          toast.error(data.message || "Failed to create account");
        }
      } else {
        // Check if this is admin login
        if (isAdminLogin) {
          console.log('👨‍⚕️ Attempting admin login...');
          const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
            email,
            password,
          }, {
            withCredentials: true,
          });

          if (data.success) {
            localStorage.setItem("aToken", data.token);
            toast.success("Admin login successful!");
            navigate("/admin-dashboard");
          } else {
            toast.error(data.message || "Admin login failed");
          }
        } else {
          console.log('🔐 Attempting user login...');
          // Fix: User login with proper credentials handling
          const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
          }, {
            withCredentials: true, // Important for HTTP-only cookies
          });

          console.log('📋 Login response:', data);

          if (data.success) {
            // Handle new response format
            const userToken = data.data?.token || data.token;
            const userData = data.data?.user;
            
            if (userToken) {
              localStorage.setItem("token", userToken);
              setToken(userToken);
            }
            
            // Store user data if available
            if (userData) {
              localStorage.setItem("userData", JSON.stringify(userData));
            }
            
            toast.success("Login successful!");
            navigate("/");
          } else {
            console.error('❌ Login failed:', data.message);
            toast.error(data.message || "Login failed");
          }
        }
      }
    } catch (err) {
      console.error("💥 Login/Signup error:", err);
      console.error("📋 Error response:", err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || "Server error";
      toast.error(errorMessage);
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

        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base" type="submit">
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
