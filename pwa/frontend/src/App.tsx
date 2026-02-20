import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import Router from "./router";
import "@styles/globals.css";
import "@styles/dashboard.css";

export default function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster
        richColors
        position="top-right"
        expand={true}
        closeButton
        duration={4000}
        visibleToasts={4}
      />
    </AuthProvider>
  );
}
