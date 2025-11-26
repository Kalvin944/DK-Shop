import { Button } from "@/components/ui/button";
import "./assets/scss/style.scss";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <div>
        <h1 className="underline font-bold">test</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
