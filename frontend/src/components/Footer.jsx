import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-serif font-bold text-indigo-600 dark:text-indigo-400"
            >
              BlogMERN
            </Link>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              A modern blogging platform built with the MERN stack. Share your
              thoughts, ideas, and stories with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/posts"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/new"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Write a Post
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
              Account
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/login"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 dark:text-gray-500 text-center">
            © {currentYear} BlogMERN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
