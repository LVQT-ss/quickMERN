import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import { Heart, MessageCircle, Send } from "lucide-react";
import FadeUp from "../../components/FadeUp";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.posts.get(id),
      api.likes.count(id),
      api.comments.listByPost(id),
      user ? api.likes.list(id) : Promise.resolve([]),
    ])
      .then(([p, c, commentsData, likesData]) => {
        if (!active) return;
        setPost(p);
        setCount(c.count || 0);
        setComments(commentsData || []);

        // Check if current user has liked this post
        if (user && likesData) {
          const userLiked = likesData.some((like) => like.user_id === user.id);
          setLiked(userLiked);
        }

        setError("");

        // Track post view (don't await, fire and forget)
        api.analytics.incrementPostView(id).catch(() => {
          // Silently fail if tracking fails
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [id, user]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const images = useMemo(
    () =>
      (post &&
        (post.PostImages || post.postImages || post.post_images || [])) ||
      [],
    [post]
  );

  const sections = useMemo(
    () =>
      (post &&
        (post.PostSections || post.postSections || post.post_sections || [])) ||
      [],
    [post]
  );

  const toggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.likes.toggle(Number(id), token);
      const c = await api.likes.count(id);
      setCount(c.count || 0);
      setLiked(!liked);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post?.title || "";

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const estimatedReadingTime = useMemo(() => {
    if (!post) return 0;
    const wordsPerMinute = 200;
    let totalWords = (post.introduction || "").split(" ").length;
    sections.forEach((section) => {
      totalWords += (section.content || "").split(" ").length;
    });
    return Math.ceil(totalWords / wordsPerMinute);
  }, [post, sections]);

  const openLightbox = (imageUrl, caption = "") => {
    setLightboxImage({ url: imageUrl, caption });
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [lightboxOpen]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        post_id: Number(id),
        body: newComment,
        ...(replyTo && { parent_id: replyTo.id }),
      };
      await api.comments.create(payload, token);

      // Fetch updated comments
      const updatedComments = await api.comments.listByPost(id);
      setComments(updatedComments || []);

      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await api.comments.remove(commentId, token);

      // Fetch updated comments
      const updatedComments = await api.comments.listByPost(id);
      setComments(updatedComments || []);
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  // Organize comments into parent and replies
  const organizedComments = useMemo(() => {
    const parentComments = comments.filter((c) => !c.parentId && !c.parent_id);
    return parentComments.map((parent) => ({
      ...parent,
      replies: comments.filter(
        (c) => (c.parentId || c.parent_id) === parent.id
      ),
    }));
  }, [comments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-6"
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Article Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-lg"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
            <svg
              className="w-4 h-4"
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
            {post.Categories && post.Categories[0] && (
              <>
                <Link
                  to={`/posts?category=${post.Categories[0].id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  {post.Categories[0].name}
                </Link>
                <svg
                  className="w-4 h-4"
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
              </>
            )}
            <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
              Article
            </span>
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-lg shadow-sm">
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
              <span className="font-medium break-words">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-9">
            {/* Article Header */}
            <FadeUp>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden mb-8">
                {/* Featured Banner */}
                {post.banner ? (
                  <div
                    className="w-full aspect-video overflow-hidden bg-gray-900 relative group cursor-pointer"
                    onClick={() => openLightbox(post.banner, post.title)}
                  >
                    <img
                      src={post.banner}
                      alt={post.title}
                      className="w-full h-full object-contain bg-gray-900"
                    />
                    {/* Fullscreen button overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 rounded-full p-4 shadow-2xl">
                        <svg
                          className="w-8 h-8 text-gray-900 dark:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-white opacity-30"
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
                  </div>
                )}

                {/* Article Meta */}
                <div className="p-8 lg:p-12">
                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.Categories?.map((category) => (
                      <Link
                        key={category.id}
                        to={`/posts?category=${category.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                    {post.status === "draft" && (
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Title - with word break */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6 break-words">
                    {post.title}
                  </h1>

                  {/* Author Info & Meta */}
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                        {(post.User?.username ||
                          post.User?.name ||
                          "A")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          {post.User?.username ||
                            post.User?.name ||
                            "Anonymous"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-3">
                          <span className="flex items-center">
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
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {estimatedReadingTime} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                          liked
                            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                          fill={liked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>{count}</span>
                      </button>

                      <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`p-2 rounded-lg transition-all ${
                          bookmarked
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        title="Bookmark"
                      >
                        <svg
                          className={`w-5 h-5 ${
                            bookmarked ? "fill-current" : ""
                          }`}
                          fill={bookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                          title="Share"
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
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </button>

                        {showShareMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                            <button
                              onClick={() => handleShare("twitter")}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-3 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                              </svg>
                              Twitter
                            </button>
                            <button
                              onClick={() => handleShare("facebook")}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-3 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                              </svg>
                              Facebook
                            </button>
                            <button
                              onClick={() => handleShare("linkedin")}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-3 text-blue-700"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                              LinkedIn
                            </button>
                            <button
                              onClick={handleCopyLink}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              {copySuccess ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Introduction */}
                  {post.introduction && (
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 p-6 rounded-r-lg">
                      <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium break-words">
                        {post.introduction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Article Content - Sections */}
            <FadeUp delay={0.2}>
              {sections.length > 0 && (
                <div className="space-y-6">
                  {sections
                    .sort(
                      (a, b) =>
                        (a.orderIndex ?? a.order_index ?? 0) -
                        (b.orderIndex ?? b.order_index ?? 0)
                    )
                    .map((section) => {
                      const sectionImages = images
                        .filter(
                          (img) =>
                            (img.sectionId ?? img.section_id ?? null) ===
                            section.id
                        )
                        .sort(
                          (a, b) =>
                            (a.orderIndex ?? a.order_index ?? 0) -
                            (b.orderIndex ?? b.order_index ?? 0)
                        );

                      return (
                        <div
                          key={section.id}
                          id={`section-${section.id}`}
                          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 lg:p-10 overflow-hidden"
                        >
                          {/* Section Title with word break */}
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b-2 border-gray-100 dark:border-gray-800 break-words">
                            {section.title}
                          </h2>

                          {/* Section Content with word break */}
                          <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap break-words overflow-wrap-anywhere">
                              {section.content}
                            </div>
                          </div>

                          {/* Section Images */}
                          {sectionImages.length > 0 && (
                            <div className="space-y-6 mt-8">
                              {sectionImages.map((img) => (
                                <div
                                  key={img.id}
                                  className="group cursor-pointer"
                                  onClick={() =>
                                    openLightbox(
                                      (img.imageUrl ?? img.image_url) || "",
                                      img.caption || ""
                                    )
                                  }
                                >
                                  <div className="overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 relative">
                                    <img
                                      src={
                                        (img.imageUrl ?? img.image_url) || ""
                                      }
                                      alt={img.caption || "Section image"}
                                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Fullscreen icon overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg
                                          className="w-12 h-12 text-white drop-shadow-lg"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                  {img.caption && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-3 text-center px-2 break-words">
                                      {img.caption}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Gallery Section */}
              {images.filter(
                (img) => (img.sectionId ?? img.section_id ?? null) == null
              ).length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 lg:p-10 mt-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
                    Image Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {images
                      .filter(
                        (img) =>
                          (img.sectionId ?? img.section_id ?? null) == null
                      )
                      .sort(
                        (a, b) =>
                          (a.orderIndex ?? a.order_index ?? 0) -
                          (b.orderIndex ?? b.order_index ?? 0)
                      )
                      .map((img) => (
                        <div
                          key={img.id}
                          className="group cursor-pointer"
                          onClick={() =>
                            openLightbox(
                              (img.imageUrl ?? img.image_url) || "",
                              img.caption || ""
                            )
                          }
                        >
                          <div className="overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-100 dark:bg-gray-800 relative">
                            <img
                              src={(img.imageUrl ?? img.image_url) || ""}
                              alt={img.caption || "Gallery image"}
                              className="w-full h-64 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Fullscreen icon overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg
                                  className="w-12 h-12 text-white drop-shadow-lg"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {img.caption && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-3 text-center break-words">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {post.Categories && post.Categories.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Tagged Under
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.Categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/posts?category=${category.id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      >
                        #{category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-8 mt-8 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                    {(post.User?.username ||
                      post.User?.name ||
                      "A")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Written by{" "}
                      {post.User?.username || post.User?.name || "Anonymous"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Passionate writer and technology enthusiast. Sharing
                      knowledge and insights to help developers grow and succeed
                      in their journey.
                    </p>
                    <div className="flex items-center space-x-4">
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div
                id="comments"
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <MessageCircle
                      className="mr-2 text-blue-600 dark:text-blue-500"
                      size={28}
                    />
                    Comments ({comments.length})
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart size={18} className="text-red-500" />
                      <span>{post?.totalLikes || count} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={18} className="text-blue-500" />
                      <span>
                        {post?.totalComments || comments.length} comments
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Form */}
                <div className="mb-8">
                  {replyTo && (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 rounded-r">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Replying to{" "}
                          <span className="font-semibold">
                            {replyTo.User?.username || "user"}
                          </span>
                        </span>
                        <button
                          onClick={() => setReplyTo(null)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmitComment} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user ? user.username?.[0]?.toUpperCase() || "U" : "?"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={
                          user
                            ? "Write a comment..."
                            : "Please log in to comment"
                        }
                        disabled={!user || submittingComment}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        rows="3"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={
                            !user || submittingComment || !newComment.trim()
                          }
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={18} />
                          {submittingComment
                            ? "Posting..."
                            : replyTo
                            ? "Post Reply"
                            : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {organizedComments.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle
                        size={48}
                        className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
                      />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No comments yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    organizedComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0"
                      >
                        {/* Parent Comment */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {(comment.User?.username || "U")[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {comment.User?.username || "Anonymous"}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  comment.createdAt || comment.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3 break-words">
                              {comment.body}
                            </p>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setReplyTo(comment)}
                                className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
                              >
                                Reply
                              </button>
                              {user &&
                                (user.id === comment.user_id ||
                                  user.role === "admin") && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
                                  >
                                    Delete
                                  </button>
                                )}
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                        {(reply.User?.username ||
                                          "U")[0].toUpperCase()}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                          {reply.User?.username || "Anonymous"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {new Date(
                                            reply.createdAt || reply.created_at
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 break-words">
                                        {reply.body}
                                      </p>
                                      <div className="flex items-center gap-4">
                                        <button
                                          onClick={() => setReplyTo(comment)}
                                          className="text-xs text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
                                        >
                                          Reply
                                        </button>
                                        {user &&
                                          (user.id === reply.user_id ||
                                            user.role === "admin") && (
                                            <button
                                              onClick={() =>
                                                handleDeleteComment(reply.id)
                                              }
                                              className="text-xs text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
                                            >
                                              Delete
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 text-center">
                <Link
                  to="/posts"
                  className="inline-flex items-center text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-lg transition-colors group"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to All Articles
                </Link>
              </div>
            </FadeUp>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Table of Contents */}
            {sections.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {sections
                    .sort(
                      (a, b) =>
                        (a.orderIndex ?? a.order_index ?? 0) -
                        (b.orderIndex ?? b.order_index ?? 0)
                    )
                    .map((section, index) => (
                      <a
                        key={section.id}
                        href={`#section-${section.id}`}
                        className="block py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors truncate"
                        title={section.title}
                      >
                        {index + 1}. {section.title}
                      </a>
                    ))}
                </nav>
              </div>
            )}

            {/* Author Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                About the Author
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                  {(post.User?.username ||
                    post.User?.name ||
                    "A")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {post.User?.username || post.User?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Content Creator
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Technology enthusiast sharing insights and tutorials to help
                developers succeed.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="flex-1 text-center py-2 px-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  Follow
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                📬 Subscribe to Newsletter
              </h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm mb-4">
                Get the latest articles and tutorials delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                Subscribe Now
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-2xl group"
            title="Close (Esc)"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
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

          {/* Image container */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || "Full screen image"}
              className="object-contain rounded-lg shadow-2xl"
              style={{ maxWidth: "none", maxHeight: "none" }}
            />

            {/* Caption */}
            {lightboxImage.caption && (
              <div className="mt-4 px-6 py-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg max-w-2xl">
                <p className="text-white text-center text-sm md:text-base break-words">
                  {lightboxImage.caption}
                </p>
              </div>
            )}

            {/* Download/Open in new tab button */}
            <a
              href={lightboxImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in New Tab
            </a>
          </div>

          {/* Instruction text */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
            Click anywhere or press{" "}
            <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> to close
          </div>
        </div>
      )}
    </div>
  );
}
