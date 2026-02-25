import { useState } from "react";
export default function ErrorPage() {
  const [errorText, _] = useState<string>("Loading...");


  return (
    <div>
      <h1>Error page</h1>
      <p style={{ color: "red" }}>{errorText}</p>
    </div>
  );
}