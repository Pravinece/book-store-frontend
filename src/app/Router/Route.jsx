import { lazy, Suspense, React } from "react";
import {createBrowserRouter,Navigate,RouterProvider} from "react-router-dom";
import NotFound from "../../components/NotFound";
import Spinner from "../../components/Spinner";

const LoginPage = lazy(() => import("../../Pages/Login/Login"));
const HeroPage = lazy(() => import("../../Pages/Hero/Hero"));
const HomePage = lazy(() => import("../../Pages/Home/Home"));
const BookPage = lazy(() => import("../../Pages/Book/Book"))
const DashboardPage = lazy(() => import("../../Pages/Dashboard/Dashboard"))

function S(Component) {
  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
}

const BASE = import.meta.env.VITE_APP_URL;

function AuthGuard({ children }) {
  // const isAuth         = getSecureUser()

  // if (!isAuth) return <Navigate to={`login`} replace />;
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
          path: "book",
          element: <AuthGuard>{S(BookPage)}</AuthGuard>,
        },
        {
          path: "dashboard",
          element: <AuthGuard>{S(DashboardPage)}</AuthGuard>,
        },
        {
          path: "about",
          element: <AuthGuard>{S(DashboardPage)}</AuthGuard>,
        },
        { path: "403", element: <Navigate to="/" replace /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  { basename: `/${BASE}/` }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
