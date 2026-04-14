import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <PageLoader text="Checking session..." />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;