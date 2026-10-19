import { hasRole } from "./cookieAuth";

export const isAdmin = () => hasRole("admin");
export const isViewer = () => hasRole("viewer");
