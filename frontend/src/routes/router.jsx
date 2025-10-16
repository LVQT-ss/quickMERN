import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/login'
import RegisterPage from '../pages/register'
import PostsListPage from '../pages/posts/list'
import PostDetailPage from '../pages/posts/detail'
import PostCreatePage from '../pages/posts/create'
import PostEditPage from '../pages/posts/edit'
import CategoriesListPage from '../pages/categories/list'
import CategoryCreatePage from '../pages/categories/create'
import CategoryEditPage from '../pages/categories/edit'
import UsersListPage from '../pages/users/list'
import UserProfilePage from '../pages/users/profile'

const router = createBrowserRouter([
  { path: '/', element: <PostsListPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/posts', element: <PostsListPage /> },
  { path: '/posts/new', element: <ProtectedRoute><PostCreatePage /></ProtectedRoute> },
  { path: '/posts/:id', element: <PostDetailPage /> },
  { path: '/posts/:id/edit', element: <ProtectedRoute><PostEditPage /></ProtectedRoute> },
  { path: '/categories', element: <CategoriesListPage /> },
  { path: '/categories/new', element: <ProtectedRoute><CategoryCreatePage /></ProtectedRoute> },
  { path: '/categories/:id/edit', element: <ProtectedRoute><CategoryEditPage /></ProtectedRoute> },
  { path: '/users', element: <ProtectedRoute><UsersListPage /></ProtectedRoute> },
  { path: '/users/:id', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


