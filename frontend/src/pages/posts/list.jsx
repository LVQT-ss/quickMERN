import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import { Heart, MessageCircle } from "lucide-react";
import FadeUp from "../../components/FadeUp";
import { createPostUrl } from "../../utils/helpers";

export default function PostsListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [userLikes, setUserLikes] = useState(new Set());
  const [likingPosts, setLikingPosts] = useState(new Set());

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
        setFilteredPosts(p);
        setCategories(c);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [status, category]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.introduction && post.introduction.toLowerCase().includes(query))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // Fetch user likes if logged in
  useEffect(() => {
    if (user && posts.length > 0) {
      Promise.all(posts.map((post) => api.likes.list(post.id)))
        .then((results) => {
          const likedPostIds = new Set();
          results.forEach((likes, index) => {
            if (likes.some((like) => like.user_id === user.id)) {
              likedPostIds.add(posts[index].id);
            }
          });
          setUserLikes(likedPostIds);
        })
        .catch((err) => console.error("Error fetching likes:", err));
    }
  }, [user, posts]);

  // Handle like toggle
  const handleLikeToggle = async (postId) => {
    if (!user) {
      alert("Please log in to like posts");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like posts");
      return;
    }

    // Optimistic update
    setLikingPosts((prev) => new Set(prev).add(postId));
    const wasLiked = userLikes.has(postId);

    try {
      await api.likes.toggle(postId, token);

      // Update user likes
      setUserLikes((prev) => {
        const newLikes = new Set(prev);
        if (wasLiked) {
          newLikes.delete(postId);
        } else {
          newLikes.add(postId);
        }
        return newLikes;
      });

      // Update posts count
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                totalLikes: wasLiked
                  ? (post.totalLikes || 0) - 1
                  : (post.totalLikes || 0) + 1,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      alert(err.message || "Failed to like post");
    } finally {
      setLikingPosts((prev) => {
        const newLiking = new Set(prev);
        newLiking.delete(postId);
        return newLiking;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our Articles
            </h1>
            <p className="text-xl text-blue-100 dark:text-purple-100 mb-8 max-w-2xl mx-auto">
              Discover insightful content, tutorials, and stories from our
              community of writers
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-32 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
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
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {user && (
                <select
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* Results Counter */}
              <span className="text-sm text-gray-600 dark:text-gray-400 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {/* Write Button */}
            {user && (
              <Link
                to="/posts/new"
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Write Article
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Loading articles...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
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
        )}

        {/* Posts Grid */}
        {!loading && filteredPosts.length > 0 && (
          <FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                >
                  {/* Post Image - KHÔNG THAY ĐỔI */}
                  {post.banner ? (
                    <Link
                      to={createPostUrl(post)}
                      className="block aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
                    >
                      <img
                        src={post.banner}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ) : post.PostImages?.[0]?.imageUrl ||
                    post.postImages?.[0]?.imageUrl ? (
                    <Link
                      to={createPostUrl(post)}
                      className="block aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
                    >
                      <img
                        src={
                          post.PostImages?.[0]?.imageUrl ||
                          post.postImages?.[0]?.imageUrl
                        }
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ) : (
                    <Link
                      to={createPostUrl(post)}
                      className="flex aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center flex-shrink-0"
                    >
                      <svg
                        className="w-20 h-20 text-white opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </Link>
                  )}

                  {/* Post Content - THÊM flex-1 và flex flex-col */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta Info - KHÔNG THAY ĐỔI */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <time className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>

                      {post.status === "published" ? (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Categories - KHÔNG THAY ĐỔI */}
                    {(post.Categories || post.categories)?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(post.Categories || post.categories).map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/posts?category=${cat.id}`}
                            className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Title - THÊM word-break và line-clamp-2 */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">
                      <Link to={createPostUrl(post)}>{post.title}</Link>
                    </h3>

                    {/* Introduction - GIỮ line-clamp-3 */}
                    {post.introduction && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {post.introduction}
                      </p>
                    )}

                    {/* Spacer - ĐẨY PHẦN DƯỚI XUỐNG ĐÁY */}
                    <div className="flex-1"></div>

                    {/* Like and Comment Stats - KHÔNG THAY ĐỔI */}
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLikeToggle(post.id);
                        }}
                        disabled={likingPosts.has(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          userLikes.has(post.id)
                            ? "text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                        } ${
                          likingPosts.has(post.id)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          user
                            ? userLikes.has(post.id)
                              ? "Unlike"
                              : "Like"
                            : "Login to like"
                        }
                      >
                        <Heart
                          size={18}
                          className={
                            userLikes.has(post.id) ? "fill-current" : ""
                          }
                        />
                        <span className="font-medium">
                          {post.totalLikes || 0}
                        </span>
                      </button>
                      <Link
                        to={`${createPostUrl(post)}#comments`}
                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span className="font-medium">
                          {post.totalComments || 0}
                        </span>
                      </Link>
                    </div>

                    {/* Author & Read More - LÚC NÀO CŨNG Ở DƯỚI CÙNG */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(post.User?.username ||
                            post.User?.name ||
                            "A")[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                          {post.User?.username ||
                            post.User?.name ||
                            "Anonymous"}
                        </span>
                      </div>
                      <Link
                        to={createPostUrl(post)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm inline-flex items-center flex-shrink-0"
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
                  </div>
                </article>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? "No articles found" : "No articles yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No articles match "${searchQuery}". Try a different search term.`
                : "Start by creating your first blog post and share your knowledge with the world."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Clear Search
              </button>
            ) : user ? (
              <Link
                to="/posts/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Post
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
