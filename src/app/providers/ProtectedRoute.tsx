import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAuthLoading } = useAuth();
  const { t } = useLanguage();

  if (isAuthLoading) {
    return <PageLoader text={t.common.checkingSession} />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;