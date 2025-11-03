import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api.js";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          api.posts.list({ status: "published" }),
          api.categories.list(),
        ]);

        // Set featured post (most recent)
        if (postsData.length > 0) {
          setFeaturedPost(postsData[0]);
          // Set remaining posts (excluding featured)
          setPosts(postsData.slice(1, 7)); // Get next 6 posts
        }

        setCategories(categoriesData);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent posts for sidebar (first 4)
  const recentPosts = posts.slice(0, 4);

  // Get category counts
  const getCategoryCount = (categoryId) => {
    return posts.filter((post) =>
      post.Categories?.some((cat) => cat.id === categoryId)
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {featuredPost && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                  Featured Post
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  {featuredPost.introduction}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>
                    By{" "}
                    {featuredPost.User?.username ||
                      featuredPost.User?.name ||
                      "Anonymous"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(featuredPost.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <Link
                  to={`/posts/${featuredPost.id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  Read More
                </Link>
              </div>
              <div className="order-first md:order-last">
                {featuredPost.banner ? (
                  <img
                    src={featuredPost.banner}
                    alt={featuredPost.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-white opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Latest Posts
            </h3>

            {posts.length === 0 && !featuredPost ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">
                  Check back later for new content
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {post.banner ? (
                      <img
                        src={post.banner}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="p-6">
                      {post.Categories && post.Categories.length > 0 && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded mb-3">
                          {post.Categories[0].name}
                        </span>
                      )}
                      <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>
                          {post.User?.username ||
                            post.User?.name ||
                            "Anonymous"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.introduction}
                      </p>
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">About</h4>
              <p className="text-gray-600 leading-relaxed">
                Welcome to TechBlog! We share insights, tutorials, and thoughts
                on web development, design, and technology. Join our community
                of learners and creators.
              </p>
            </div>

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Posts
                </h4>
                <ul className="space-y-3">
                  {recentPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h4>
                <ul className="space-y-2">
                  {categories.slice(0, 5).map((category) => {
                    const count = getCategoryCount(category.id);
                    return (
                      <li key={category.id}>
                        <Link
                          to={`/posts?category=${category.id}`}
                          className="flex justify-between items-center text-gray-700 hover:text-blue-600 transition-colors py-1"
                        >
                          <span>{category.name}</span>
                          <span className="text-sm text-gray-500">
                            ({count})
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
