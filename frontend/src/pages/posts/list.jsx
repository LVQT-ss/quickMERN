import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";

export default function PostsListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const status = user ? searchParams.get("status") || "" : "published";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.posts.list({
        status: status || undefined,
        category: category || undefined,
      }),
      api.categories.list(),
    ])
      .then(([p, c]) => {
        if (!active) return;
        setPosts(p);
        setCategories(c);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [status, category]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32 min-h-screen transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Blog Posts
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-300">
            Share your thoughts and ideas with the world.
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4 items-center">
            {user && (
              <select
                className="px-3 py-2 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={status}
                onChange={(e) =>
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev);
                    const v = e.target.value;
                    if (v) p.set("status", v);
                    else p.delete("status");
                    return p;
                  })
                }
              >
                <option value="">All Posts</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
              </select>
            )}

            <select
              className="px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-full text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={category}
              onChange={(e) =>
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  const v = e.target.value;
                  if (v) p.set("category", v);
                  else p.delete("category");
                  return p;
                })
              }
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {user && (
            <Link
              to="/posts/new"
              className="px-4 py-2 bg-indigo-600 dark:bg-gray-800/60 text-white dark:text-gray-300 rounded-full hover:bg-indigo-700 dark:hover:bg-gray-800 transition duration-200 font-medium"
            >
              Write New Post
            </Link>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-gray-300"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-md mt-8">
            {error}
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 dark:border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time
                  dateTime={post.createdAt}
                  className="text-gray-600 dark:text-gray-400"
                >
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <div className="flex gap-2">
                  <span className="relative z-10 rounded-full px-3 py-1.5 font-medium">
                    {post.status === "published" ? (
                      <span className="text-green-300 bg-green-900/30 px-3 py-1.5 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="text-amber-300 bg-amber-900/30 px-3 py-1.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </span>
                  {post.categories?.map((category) => (
                    <span
                      key={category.id}
                      className="relative z-10 rounded-full bg-indigo-100 dark:bg-gray-800/60 px-3 py-1.5 font-medium text-indigo-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-gray-800"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
              {post.PostImages?.[0]?.imageUrl && (
                <div className="relative w-full mt-4 aspect-[16/9] overflow-hidden rounded-2xl">
                  <img
                    src={post.PostImages[0].imageUrl}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-gray-300">
                  <Link to={`/posts/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                {post.introduction && (
                  <p className="mt-5 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                    {post.introduction}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-300">
              No posts found
            </h3>
            <p className="text-gray-500 mt-2">
              Start by creating your first blog post
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
