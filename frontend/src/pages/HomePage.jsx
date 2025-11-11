import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api.js";
import { TrendingUp, Heart, MessageCircle, Eye } from "lucide-react";
import FadeUp from "../components/FadeUp";
import { createPostUrl } from "../utils/helpers";
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesData, trendingData] = await Promise.all([
          api.posts.list({ status: "published" }),
          api.categories.list(),
          api.posts.trending(5),
        ]);

        // Set featured post (most recent)
        if (postsData.length > 0) {
          setFeaturedPost(postsData[0]);
          // Set remaining posts (excluding featured)
          const remainingPosts = postsData.slice(1, 7); // Get next 6 posts
          setPosts(remainingPosts);
          setFilteredPosts(remainingPosts);
        }

        setCategories(categoriesData);
        setTrendingPosts(trendingData);
        setError("");

        // Track site visit (fire and forget)
        api.analytics
          .trackVisit({
            page: "/",
            referrer: document.referrer,
          })
          .catch(() => {
            // Silently fail if tracking fails
          });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.introduction.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // Get recent posts for sidebar (first 4)
  const recentPosts = filteredPosts.slice(0, 4);

  // Get category counts
  const getCategoryCount = (categoryId) => {
    return posts.filter((post) =>
      post.Categories?.some((cat) => cat.id === categoryId)
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
        <FadeUp>
          <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    Latest Post
                  </span>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 break-words line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                    {featuredPost.introduction}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
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
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Heart size={18} className="text-red-500" />
                      <span>{featuredPost.totalLikes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={18} className="text-blue-500" />
                      <span>{featuredPost.totalComments || 0} comments</span>
                    </div>
                  </div>
                  <Link
                    to={createPostUrl(featuredPost)}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-block"
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
        </FadeUp>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts Grid */}
          <div className="lg:col-span-2">
            <FadeUp delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Latest Posts
                </h3>
                {searchQuery && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "result" : "results"}
                  </span>
                )}
              </div>

              {filteredPosts.length === 0 && !featuredPost ? (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {searchQuery ? "No posts found" : "No posts yet"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? `No posts match "${searchQuery}"`
                      : "Check back later for new content"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                      {/* Post Image */}
                      {post.banner ? (
                        <img
                          src={post.banner}
                          alt={post.title}
                          className="w-full h-48 object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-600"
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

                      {/* Post Content */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Category Badge */}
                        {post.Categories && post.Categories.length > 0 && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded mb-3 w-fit">
                            {post.Categories[0].name}
                          </span>
                        )}

                        {/* Title - Line clamp 2 + break-words */}
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 break-words">
                          <Link to={createPostUrl(post)}>{post.title}</Link>
                        </h4>

                        {/* Author & Date */}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="truncate">
                            {post.User?.username ||
                              post.User?.name ||
                              "Anonymous"}
                          </span>
                          <span className="mx-2 flex-shrink-0">•</span>
                          <span className="flex-shrink-0">
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

                        {/* Introduction - Line clamp 3 */}
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {post.introduction}
                        </p>

                        {/* Spacer - Push stats & read more to bottom */}
                        <div className="flex-1"></div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Eye
                              size={16}
                              className="text-gray-500 dark:text-gray-400"
                            />
                            <span>{post.viewCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={16} className="text-red-500" />
                            <span>{post.totalLikes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle
                              size={16}
                              className="text-blue-500"
                            />
                            <span>{post.totalComments || 0}</span>
                          </div>
                        </div>

                        {/* Read More Link */}
                        <Link
                          to={createPostUrl(post)}
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center group"
                        >
                          Read More
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
            </FadeUp>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-10 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Clear search"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <button className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
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
              {searchQuery && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Found {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "result" : "results"}
                </p>
              )}
            </div>

            {/* Trending Posts (Most Liked) */}
            <FadeUp delay={0.4}>
              {trendingPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                      Trending Posts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {trendingPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={createPostUrl(post)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <span className="flex items-center gap-2 flex-1 min-w-0">
                          <Heart
                            size={16}
                            className="text-red-500 flex-shrink-0"
                          />
                          <span className="font-medium text-slate-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {post.title}
                          </span>
                        </span>
                        <span className="text-slate-500 dark:text-gray-400 text-sm ml-2 flex-shrink-0">
                          {post.totalLikes || 0}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </FadeUp>

            {/* Recent Posts */}
            <FadeUp delay={0.5}>
              {recentPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Recent Posts
                  </h4>
                  <ul className="space-y-3">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          to={createPostUrl(post)}
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
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
            </FadeUp>

            {/* Categories */}
            <FadeUp delay={0.6}>
              {categories.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Categories
                  </h4>
                  <ul className="space-y-2">
                    {categories.slice(0, 5).map((category) => {
                      const count = getCategoryCount(category.id);
                      return (
                        <li key={category.id}>
                          <Link
                            to={`/posts?category=${category.id}`}
                            className="flex justify-between items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                          >
                            <span>{category.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({count})
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </FadeUp>
          </aside>
        </div>
      </div>
    </div>
  );
}
