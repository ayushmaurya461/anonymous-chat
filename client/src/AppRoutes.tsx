import { Authenticated } from "./authenticated/Authenticated";
import { useAuth } from "./hooks/use-auth";
import { Unauthenticated } from "./unauthenticated/Unauthenticated";

export const AppRoutes = () => {
  const { user } = useAuth();

  return user ? <Authenticated /> : <Unauthenticated />;
};
