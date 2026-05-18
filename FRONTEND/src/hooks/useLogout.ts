import { useLocation } from "wouter";
import { useAuth } from "./useAuth";

export function useLogout() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  return () => {
    logout();
    setLocation("/login");
  };
}
