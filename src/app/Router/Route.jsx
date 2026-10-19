import { lazy, Suspense } from "react";
import { createBrowserRouter, Link, Navigate, RouterProvider, useLocation } from "react-router-dom";
import NotFound from "../../components/NotFound";
import Spinner from "../../components/Spinner";
import { hasRole, validateToken } from "../../utils/cookieAuth";

const LoginPage = lazy(() => import("../../Pages/Login/Login"));
const HeroPage = lazy(() => import("../../Pages/Hero/Hero"));
const HomePage = lazy(() => import("../../Pages/Home/Home"));
const BookPage = lazy(() => import("../../Pages/Book/Book"))
const DashboardPage = lazy(() => import("../../Pages/Dashboard/Dashboard"))
const AdminPanelPage = lazy(() => import("../../Pages/AdminPanel/AdminPanel"))
const AboutPage = lazy(() => import("../../Pages/About/About"))

function S(Component) {
  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
}

function AuthGuard({ children, requiredRole }) {
  // const location = useLocation();
  // const { isValid } = validateToken();

  // if (!isValid) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // if (requiredRole && !hasRole(requiredRole)) {
  //   return <Navigate to="/403" replace />;
  // }

  return children;
}

function PathGuard({ children, requiredRole }) {
  const location = useLocation();
  const { isValid } = validateToken();

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: S(LoginPage),
    },
    {
      path: "/",
      element: (
        <AuthGuard>
          <HeroPage />
        </AuthGuard>
      ),
      children: [
        { index: true, element: S(HomePage) },
        {
          path: ":id",
          element: <AuthGuard>{S(BookPage)}</AuthGuard>,
        },
        {
          path: "dashboard",
          element: <AuthGuard>{S(DashboardPage)}</AuthGuard>,
        },
        {
          path: "dashboard/adminpanel",
          element: (
            <PathGuard requiredRole="admin">
              {S(AdminPanelPage)}
            </PathGuard>
          ),
        },
        {
          path: "about",
          element: <AuthGuard>{S(AboutPage)}</AuthGuard>,
        },
        {
          path: "403",
          element: (
            <main className="p-8 text-center" role="alert">
              <h1 className="text-xl font-semibold">Access denied</h1>
              <p className="mt-2">You do not have permission to view this page.</p>
              <Link className="mt-4 inline-block underline" to="/dashboard">
                Return to dashboard
              </Link>
            </main>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}