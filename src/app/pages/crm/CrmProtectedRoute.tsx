import { Navigate } from "react-router";
import { useCrm } from "../../context/crm-context";
import { CrmLayout } from "./CrmLayout";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function CrmProtectedRoute({ children, adminOnly = false }: Props) {
  const { crmUser, loading } = useCrm();

  if (loading) {
    return (
      <div className="min-h-screen luxury-page-gradient flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!crmUser) {
    return <Navigate to="/crm" replace />;
  }

  if (adminOnly && crmUser.role !== "admin") {
    return <Navigate to="/crm/dashboard" replace />;
  }

  return <CrmLayout>{children}</CrmLayout>;
}
