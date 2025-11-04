import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../utils/auth";
import {
  LayoutDashboard,
  FileText,
  Edit3,
  Trash2,
  Users,
  Tag,
  MessageSquare,
  Heart,
  Eye,
  TrendingUp,
  Clock,
  PlusCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [postFilter, setPostFilter] = useState("all"); // all, published, draft
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview"); // overview, posts, categories, users, comments, analytics

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    Promise.all([
      api.posts.list(),
      api.categories.list(),
      user?.role === "admin" ? api.users.list(token) : Promise.resolve([]),
      // Fetch all comments (we'll need to aggregate from posts)
      api.posts.list().then((posts) =>
        Promise.all(posts.map((p) => api.comments.listByPost(p.id).catch(() => [])))
      ),
      api.analytics.getSiteStats(token).catch(() => null),
    ])
      .then(([postsData, categoriesData, usersData, commentsArrays, analyticsData]) => {
        setPosts(postsData);
        setCategories(categoriesData);
        setUsers(usersData);
        const allComments = commentsArrays.flat();
        setComments(allComments);
        setAnalytics(analyticsData);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Statistics
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    draftPosts: posts.filter((p) => p.status === "draft").length,
    totalCategories: categories.length,
    totalUsers: users.length,
    totalComments: comments.length,
    totalLikes: posts.reduce((sum, p) => sum + (parseInt(p.totalLikes, 10) || 0), 0),
    totalViews: posts.reduce((sum, p) => sum + (parseInt(p.viewCount, 10) || 0), 0),
    siteVisitsToday: analytics?.visitsToday || 0,
    siteVisitsThisWeek: analytics?.visitsThisWeek || 0,
    siteVisitsThisMonth: analytics?.visitsThisMonth || 0,
    totalSiteVisits: analytics?.totalVisits || 0,
  };

  // Filter posts
  const filteredPosts = posts
    .filter((post) => {
      if (postFilter === "published") return post.status === "published";
      if (postFilter === "draft") return post.status === "draft";
      return true;
    })
    .filter((post) => {
      if (!searchQuery) return true;
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.introduction?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Recent posts (last 5)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent comments (last 5)
  const recentComments = [...comments]
    .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
    .slice(0, 5);

  // Top posts by likes
  const topPosts = [...posts]
    .sort((a, b) => (parseInt(b.totalLikes, 10) || 0) - (parseInt(a.totalLikes, 10) || 0))
    .slice(0, 5);

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.posts.remove(postId, token);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      alert(err.message || "Failed to delete post");
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.categories.remove(categoryId, token);
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.comments.remove(commentId, token);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.message || "Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <LayoutDashboard size={36} />
                <h1 className="text-4xl font-bold">Dashboard</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Welcome back, <span className="font-semibold">{user?.username}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/posts/new"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <PlusCircle size={20} />
                New Post
              </Link>
              <Link
                to="/categories/new"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <Tag size={20} />
                New Category
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "categories", label: "Categories", icon: Tag },
              { id: "comments", label: "Comments", icon: MessageSquare },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              ...(user?.role === "admin" ? [{ id: "users", label: "Users", icon: Users }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalPosts}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Total Posts</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.publishedPosts} published, {stats.draftPosts} drafts
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Tag className="text-purple-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalCategories}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Categories</h3>
                <p className="text-sm text-gray-500 mt-1">Active categories</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Heart className="text-green-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {Number(stats.totalLikes).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-600 font-medium">Total Likes</h3>
                <p className="text-sm text-gray-500 mt-1">Across all posts</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <MessageSquare className="text-orange-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalComments}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Comments</h3>
                <p className="text-sm text-gray-500 mt-1">Total discussions</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Posts */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                  <Link to="/posts" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {post.banner ? (
                          <img src={post.banner} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/posts/${post.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span
                            className={`px-2 py-1 rounded-full font-medium ${
                              post.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {parseInt(post.totalLikes, 10) || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {parseInt(post.totalComments, 10) || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Posts */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="text-orange-500" size={24} />
                    Top Posts
                  </h2>
                </div>
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                    <div key={post.id} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/posts/${post.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Heart size={14} className="text-red-500" />
                          <span className="font-semibold">{parseInt(post.totalLikes, 10) || 0} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Comments */}
              <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Comments</h2>
                </div>
                <div className="space-y-4">
                  {recentComments.length > 0 ? (
                    recentComments.map((comment) => (
                      <div key={comment.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {(comment.User?.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {comment.User?.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt || comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2">{comment.body}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {selectedTab === "posts" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={postFilter}
                  onChange={(e) => setPostFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Posts ({posts.length})</option>
                  <option value="published">Published ({stats.publishedPosts})</option>
                  <option value="draft">Drafts ({stats.draftPosts})</option>
                </select>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                              {post.banner ? (
                                <img src={post.banner} alt={post.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                              )}
                            </div>
                            <div>
                              <Link
                                to={`/posts/${post.id}`}
                                className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                              >
                                {post.title}
                              </Link>
                              {post.Categories && post.Categories.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {post.Categories.slice(0, 2).map((cat) => (
                                    <span
                                      key={cat.id}
                                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded"
                                    >
                                      {cat.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{post.User?.username || "Unknown"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.status === "published" ? (
                              <CheckCircle size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Heart size={14} className="text-red-500" />
                              {parseInt(post.totalLikes, 10) || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={14} className="text-blue-500" />
                              {parseInt(post.totalComments, 10) || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/posts/${post.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery ? "No posts found matching your search" : "No posts yet"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {selectedTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                <Link
                  to="/categories/new"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={20} />
                  New Category
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const postCount = posts.filter((p) => p.Categories?.some((c) => c.id === category.id)).length;
                  return (
                    <div key={category.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">{postCount} posts</span>
                        <div className="flex gap-2">
                          <Link
                            to={`/categories/${category.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">No categories yet</div>
              )}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {selectedTab === "comments" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Comments</h2>

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {(comment.User?.username || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{comment.User?.username || "Anonymous"}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt || comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.body}</p>
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/posts/${comment.post_id || comment.postId}`}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Post
                          </Link>
                          {(user?.role === "admin" || user?.id === comment.user_id) && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">No comments yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === "analytics" && analytics && (
          <div className="space-y-6">
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Eye className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalSiteVisits.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Total Site Visits</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All time</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.siteVisitsToday.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Visits Today</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {analytics.uniqueVisitorsToday} unique
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Clock className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.siteVisitsThisWeek.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold">This Week</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 7 days</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Eye className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalViews.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Total Post Views</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All posts</p>
              </div>
            </div>

            {/* Most Viewed Posts */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Most Viewed Posts
              </h2>
              <div className="space-y-4">
                {analytics.mostViewedPosts && analytics.mostViewedPosts.length > 0 ? (
                  analytics.mostViewedPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-8">
                          #{index + 1}
                        </span>
                        <Link
                          to={`/posts/${post.id}`}
                          className="flex-1 min-w-0"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                        <span>{post.viewCount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No view data available yet
                  </div>
                )}
              </div>
            </div>

            {/* Visits by Day Chart */}
            {analytics.visitsByDay && analytics.visitsByDay.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Visits Over Time (Last 30 Days)
                </h2>
                <div className="space-y-2">
                  {analytics.visitsByDay.slice(-10).map((day) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all"
                            style={{
                              width: `${Math.max((parseInt(day.count) / Math.max(...analytics.visitsByDay.map(d => parseInt(d.count)))) * 100, 5)}%`
                            }}
                          >
                            {day.count}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab (Admin Only) */}
        {selectedTab === "users" && user?.role === "admin" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Posts
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => {
                      const userPosts = posts.filter((p) => p.user_id === u.id).length;
                      return (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                {(u.username || "U")[0].toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900">{u.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{u.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{userPosts} posts</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(u.createdAt || u.created_at).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No users found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

