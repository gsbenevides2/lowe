import "@public/styles/global.css";

import { useState } from "react";
import { createRoot } from "react-dom/client";

import { Button } from "@public/components/ui/button";

import { helloClient } from "./hello-client";
import { instrumentFrontend } from "./instrumentFrontend";

instrumentFrontend();

function App() {
  const [message, setMessage] = useState("");

  async function hello() {
    const { data } = await helloClient.api.hello.get();
    setMessage(data?.message ?? "error");
  }

  return (
    <main
      className="
      flex min-h-screen flex-col items-center justify-center gap-4
    "
    >
      <h1 className="text-3xl font-bold">Edelfalter</h1>
      <Button onClick={hello}>Say hello</Button>
      {message && <p className="text-muted-foreground">{message}</p>}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
