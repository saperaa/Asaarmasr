import { Navigate } from "react-router";
import { useCrm } from "../../context/crm-context";
import { CrmLayout } from "./CrmLayout";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function CrmProtectedRoute({ children, adminOnly = false }: Props) {
  const { crmUser } = useCrm();

  if (!crmUser) {
    return <Navigate to="/crm" replace />;
  }

  if (adminOnly && crmUser.role !== "admin") {
    return <Navigate to="/crm/dashboard" replace />;
  }

  return <CrmLayout>{children}</CrmLayout>;
}
