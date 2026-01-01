import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ErrorPage() {
  const [errorText, setErrorText] = useState<string>("Loading...");
  const navigate = useNavigate();
  useEffect(() => {
    
    const fetchData = async () => {
      const data = await fetch(`${import.meta.env.VITE_BACKEND_SPOTIFY_API}/error`, { credentials: "include" });
      const result = await data.json();
      
      if (!result.error) {
        navigate("../home");
      }
      
      setErrorText(result.error);
    }
    fetchData();

  }, []);

  return (
    <div>
      <h1>Error page</h1>
      <p style={{ color: "red" }}>{errorText}</p>
    </div>
  );
}