import "@/styles/globals.css";

import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    let dispositivoId = localStorage.getItem("dispositivoId");
    if (!dispositivoId) {
      dispositivoId = Math.random().toString(36).substr(2, 9); // Genera un ID único
      localStorage.setItem("dispositivoId", dispositivoId);
    }
  }, []);

  return <Component {...pageProps} />;
}
