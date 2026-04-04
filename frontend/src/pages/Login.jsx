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
  const isSuperAdminLogin = location.pathname === "/super-admin-login";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    try {
      let result;
      
      if (state === "Sign Up") {
        console.log('🔐 Attempting registration for:', email);
        result = await register(name, email, password);
        if (result.success) {
          console.log('✅ Registration successful, redirecting to main page');
          toast.success("Account created successfully! Please login.");
          // Switch to login state after successful registration
          setState("Login");
        }
      } else {
        console.log('🔐 Attempting login for:', email);
        
        // Handle different login types
        if (isSuperAdminLogin) {
          // Super Admin login
          const response = await fetch(`${backendUrl}/api/super-admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
          result = await response.json();
          
          if (result.success) {
            console.log('✅ Super Admin login successful');
            toast.success("Super Admin login successful!");
            
            // Save token and user data
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('userData', JSON.stringify(result.data.user));
            
            navigate('/super-admin-dashboard', { replace: true });
          }
        } else if (isAdminLogin) {
          // Admin login (check both admin and super admin)
          const adminResponse = await fetch(`${backendUrl}/api/admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
          const adminResult = await adminResponse.json();
          
          if (adminResult.success) {
            console.log('✅ Admin login successful');
            toast.success("Admin login successful!");
            
            // Save token and user data
            localStorage.setItem('token', adminResult.data.token);
            localStorage.setItem('userData', JSON.stringify({
              ...adminResult.data.user,
              role: 'admin'
            }));
            
            navigate('/admin-dashboard', { replace: true });
          } else {
            // Try super admin login as fallback
            const superAdminResponse = await fetch(`${backendUrl}/api/super-admin/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
            });
            
            const superAdminResult = await superAdminResponse.json();
            
            if (superAdminResult.success) {
              console.log('✅ Super Admin login successful (fallback)');
              toast.success("Super Admin login successful!");
              
              // Save token and user data
              localStorage.setItem('token', superAdminResult.data.token);
              localStorage.setItem('userData', JSON.stringify(superAdminResult.data.user));
              
              navigate('/super-admin-dashboard', { replace: true });
            } else {
              result = { success: false, message: 'Invalid credentials' };
            }
          }
        } else {
          // Regular user login
          result = await login(email, password, false);
          if (result.success) {
            console.log('✅ User login successful, redirecting to main page');
            toast.success("Login successful!");
            // Navigate to main page after successful login
            navigate("/", { replace: true });
          }
        }
        
        if (result.success) {
          console.log('✅ Login successful');
        } else {
          console.log('❌ Login failed:', result.message);
          toast.error(result.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {isSuperAdminLogin ? "Super Admin Login" : isAdminLogin ? "Admin Login" : state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>Please {isSuperAdminLogin ? "log in as super admin" : isAdminLogin ? "log in as admin" : state === "Sign Up" ? "sign up" : "log in"} to {isSuperAdminLogin ? "manage the entire system" : isAdminLogin ? "manage the hospital" : "book appointment"}</p>

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
