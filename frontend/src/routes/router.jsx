import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import PostsListPage from "../pages/posts/list";
import PostDetailPage from "../pages/posts/detail";
import PostCreatePage from "../pages/posts/create";
import PostEditPage from "../pages/posts/edit";
import CategoriesListPage from "../pages/categories/list";
import CategoryCreatePage from "../pages/categories/create";
import CategoryEditPage from "../pages/categories/edit";
import UsersListPage from "../pages/users/list";
import UserProfilePage from "../pages/users/profile";
import HomePage from "../pages/HomePage";
import About from "../pages/about";
import Dashboard from "../pages/Dashboard";
import ServicesPage from "../pages/Services";
import PolicyPage from "../pages/PolicyPage";
import TermsPage from "../pages/TermsPage";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/dashboard",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/policy", element: <PolicyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/posts", element: <PostsListPage /> },
      {
        path: "/posts/new",
        element: (
          <AdminRoute>
            <PostCreatePage />
          </AdminRoute>
        ),
      },
      { path: "/posts/:id", element: <PostDetailPage /> },
      {
        path: "/posts/:id/edit",
        element: (
          <AdminRoute>
            <PostEditPage />
          </AdminRoute>
        ),
      },
      { path: "/categories", element: <CategoriesListPage /> },
      {
        path: "/categories/new",
        element: (
          <AdminRoute>
            <CategoryCreatePage />
          </AdminRoute>
        ),
      },
      {
        path: "/categories/:id/edit",
        element: (
          <AdminRoute>
            <CategoryEditPage />
          </AdminRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <AdminRoute>
            <UsersListPage />
          </AdminRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      // Route động cho category/post - ĐẶT CUỐI CÙNG
      {
        path: "/:category/:idSlug/edit",
        element: (
          <AdminRoute>
            <PostEditPage />
          </AdminRoute>
        ),
      },
      { path: "/:category/:idSlug", element: <PostDetailPage /> },
      
      // Catch-all route cho 404 - PHẢI Ở CUỐI CÙNG
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
