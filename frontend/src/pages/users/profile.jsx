import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import {
  User,
  Mail,
  Calendar,
  FileText,
  Heart,
  MessageCircle,
  Edit3,
  Save,
  X,
  Settings,
  Lock,
  Shield,
  TrendingUp,
  Award,
} from "lucide-react";

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, posts, comments, settings

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isOwnProfile = !id || id === String(authUser?.id);

  useEffect(() => {
    const userId = id || authUser?.id;
    if (!userId) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    Promise.all([
      api.users.get(userId, token),
      api.posts.list(),
      api.comments.listByUser(userId),
    ])
      .then(([userData, allPosts, userComments]) => {
        setUser(userData);
        setEmail(userData.email || "");
        setBio(userData.bio || "");
        setAvatar(userData.avatar || "");

        // Filter posts by this user
        const userPosts = allPosts.filter(
          (p) => p.user_id === parseInt(userId)
        );
        setPosts(userPosts);
        setComments(userComments);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, authUser, navigate]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = id || authUser?.id;
      const updatedUser = await api.users.update(
        userId,
        { email, bio, avatar },
        token
      );

      setUser(updatedUser);

      // Update auth context if editing own profile
      if (isOwnProfile) {
        updateUser(updatedUser);
      }

      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // Password change would need a backend endpoint
    // For now, just show success message
    setPasswordError("");
    alert("Password change functionality needs backend implementation");
    setShowPasswordChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    draftPosts: posts.filter((p) => p.status === "draft").length,
    totalLikes: posts.reduce(
      (sum, p) => sum + (parseInt(p.totalLikes, 10) || 0),
      0
    ),
    totalComments: posts.reduce(
      (sum, p) => sum + (parseInt(p.totalComments, 10) || 0),
      0
    ),
    userComments: comments.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            User not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user profile you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className={`text-6xl font-bold text-white ${
                    user.avatar ? "hidden" : ""
                  }`}
                >
                  {(user.username || "U")[0].toUpperCase()}
                </span>
              </div>
              {user.role === "admin" && (
                <div
                  className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg"
                  title="Admin"
                >
                  <Shield size={20} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-bold">{user.username}</h1>
                {user.role === "admin" && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-blue-100 text-lg mb-4">{user.email}</p>
              {user.bio && (
                <p className="text-white/90 max-w-2xl mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span className="font-semibold">{stats.totalPosts}</span>
                  <span className="text-blue-100">Posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={18} />
                  <span className="font-semibold">{stats.totalLikes}</span>
                  <span className="text-blue-100">Likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  <span className="font-semibold">{stats.totalComments}</span>
                  <span className="text-blue-100">Comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span className="text-blue-100">
                    Joined{" "}
                    {new Date(
                      user.createdAt || user.created_at
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {isOwnProfile && (
              <div>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setActiveTab("settings");
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  {isEditing ? (
                    <>
                      <X size={20} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 size={20} />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <X className="mr-2" size={20} />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-t-xl shadow-md mt-8">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "comments", label: "Comments", icon: MessageCircle },
              ...(isOwnProfile
                ? [{ id: "settings", label: "Settings", icon: Settings }]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
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

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-b-xl shadow-md p-8 mb-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <FileText
                        className="text-blue-600 dark:text-blue-400"
                        size={24}
                      />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalPosts}
                    </span>
                  </div>
                  <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                    Total Posts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stats.publishedPosts} published, {stats.draftPosts} drafts
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-100 dark:bg-red-800 rounded-lg">
                      <Heart
                        className="text-red-600 dark:text-red-400"
                        size={24}
                      />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalLikes}
                    </span>
                  </div>
                  <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                    Total Likes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Across all posts
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg">
                      <MessageCircle
                        className="text-green-600 dark:text-green-400"
                        size={24}
                      />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalComments}
                    </span>
                  </div>
                  <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                    Comments
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    On your posts
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg">
                      <Award
                        className="text-purple-600 dark:text-purple-400"
                        size={24}
                      />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.userComments}
                    </span>
                  </div>
                  <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                    Your Comments
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total contributions
                  </p>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  About
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="text-gray-400 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Email
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="text-gray-400 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Role
                        </p>
                        <p className="text-gray-900 capitalize">
                          {user.role || "user"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-gray-400 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Member Since
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(
                            user.createdAt || user.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {user.bio && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        Bio
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {user.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              {posts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                          {post.banner ? (
                            <img
                              src={post.banner}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/posts/${post.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {post.status}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {parseInt(post.totalLikes, 10) || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              {parseInt(post.totalComments, 10) || 0}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {posts.length > 3 && (
                    <button
                      onClick={() => setActiveTab("posts")}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View all posts →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Posts ({posts.length})
                </h2>
                {isOwnProfile && (
                  <Link
                    to="/posts/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    New Post
                  </Link>
                )}
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isOwnProfile
                      ? "Start writing your first blog post!"
                      : "This user hasn't posted anything yet."}
                  </p>
                  {isOwnProfile && (
                    <Link
                      to="/posts/new"
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Create First Post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {post.banner ? (
                          <img
                            src={post.banner}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.Categories && post.Categories.length > 0 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {post.Categories[0].name}
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/posts/${post.id}`}
                          className="font-bold text-lg text-gray-900 hover:text-blue-600 line-clamp-2 mb-2"
                        >
                          {post.title}
                        </Link>
                        {post.introduction && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {post.introduction}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {parseInt(post.totalLikes, 10) || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              {parseInt(post.totalComments, 10) || 0}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Comments ({comments.length})
                </h2>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isOwnProfile
                      ? "You haven't commented on any posts yet."
                      : "This user hasn't commented on any posts yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          {/* Post Reference */}
                          {comment.Post && (
                            <div className="mb-3">
                              <Link
                                to={`/posts/${comment.Post.id}`}
                                className="flex items-start gap-3 group"
                              >
                                {comment.Post.banner && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img
                                      src={comment.Post.banner}
                                      alt={comment.Post.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Commented on
                                  </p>
                                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {comment.Post.title}
                                  </h4>
                                </div>
                              </Link>
                            </div>
                          )}

                          {/* Comment Body */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200">
                              {comment.body}
                            </p>
                          </div>

                          {/* Comment Meta */}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(
                                comment.created_at || comment.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            {comment.parent_id && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                Reply
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && isOwnProfile && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                      placeholder="Enter avatar image URL"
                    />
                    {avatar && (
                      <div className="mt-3 flex items-start gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                          <img
                            src={avatar}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Avatar preview
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={20} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEmail(user.email || "");
                          setBio(user.bio || "");
                          setAvatar(user.avatar || "");
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Change Section */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock size={20} />
                  Change Password
                </h3>

                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4 max-w-md">
                    {passwordError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded">
                        {passwordError}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handlePasswordChange}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordChange(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
