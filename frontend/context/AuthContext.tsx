import { createContext, useContext, useEffect, useState } from "react";
import LoadingSpinner from "../ui/common/LoadingSpinner";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  userName: string;
  setAuth: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userName: "",
  setAuth: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {

    const fetchLoginStatus = async () => {
      try {
        //orignal
        // const data = await fetch(
        //   `${import.meta.env.VITE_BACKEND_AUTH_API}/confirm_session`,
        //   { credentials: "include" }
        // );

        //ngrok
        const data = await fetch(
          `/api/user/confirm_session`,
          { credentials: "include" }
        );

        const user = await data.json()
        if (data.ok) {
          setIsAuthenticated(true);
          setUserName(user)

        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    fetchLoginStatus();
  }, []);


  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userName, setAuth: setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  return useContext(AuthContext);
}