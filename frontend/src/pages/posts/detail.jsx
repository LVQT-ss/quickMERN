import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";

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
  const [activeSection, setActiveSection] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.posts.get(id), api.likes.count(id)])
      .then(([p, c]) => {
        if (!active) return;
        setPost(p);
        setCount(c.count || 0);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-6"
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Article Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg"
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
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500 space-x-2">
            <Link to="/" className="hover:text-blue-600 transition-colors">
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
                  className="hover:text-blue-600 transition-colors"
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
            <span className="text-gray-900 font-medium truncate">Article</span>
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Featured Banner */}
              {post.banner ? (
                <div className="w-full aspect-video overflow-hidden bg-gray-900">
                  <img
                    src={post.banner}
                    alt={post.title}
                    className="w-full h-full object-contain bg-gray-900"
                  />
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
                      className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                  {post.status === "draft" && (
                    <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-50 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                {/* Title - with word break */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6 break-words">
                  {post.title}
                </h1>

                {/* Author Info & Meta */}
                <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                      {(post.User?.username ||
                        post.User?.name ||
                        "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {post.User?.username || post.User?.name || "Anonymous"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-3">
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
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                        className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => handleShare("twitter")}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
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
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
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
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
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
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-600"
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
                  <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                    <p className="text-xl text-gray-800 leading-relaxed font-medium break-words">
                      {post.introduction}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Article Content - Sections */}
            {sections.length > 0 && (
              <div className="space-y-6">
                {sections
                  .sort(
                    (a, b) =>
                      (a.orderIndex ?? a.order_index ?? 0) -
                      (b.orderIndex ?? b.order_index ?? 0)
                  )
                  .map((section, index) => {
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
                        className="bg-white rounded-xl shadow-lg p-8 lg:p-10 overflow-hidden"
                      >
                        {/* Section Title with word break */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100 break-words">
                          {section.title}
                        </h2>

                        {/* Section Content with word break */}
                        <div className="prose prose-lg max-w-none">
                          <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap break-words overflow-wrap-anywhere">
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
                              >
                                <div className="overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300">
                                  <img
                                    src={(img.imageUrl ?? img.image_url) || ""}
                                    alt={img.caption || "Section image"}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                {img.caption && (
                                  <p className="text-sm text-gray-600 italic mt-3 text-center px-2 break-words">
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
              <div className="bg-white rounded-xl shadow-lg p-8 lg:p-10 mt-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
                  Image Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {images
                    .filter(
                      (img) => (img.sectionId ?? img.section_id ?? null) == null
                    )
                    .sort(
                      (a, b) =>
                        (a.orderIndex ?? a.order_index ?? 0) -
                        (b.orderIndex ?? b.order_index ?? 0)
                    )
                    .map((img) => (
                      <div key={img.id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-100">
                          <img
                            src={(img.imageUrl ?? img.image_url) || ""}
                            alt={img.caption || "Gallery image"}
                            className="w-full h-64 object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {img.caption && (
                          <p className="text-sm text-gray-600 italic mt-3 text-center break-words">
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
              <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
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
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      #{category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mt-8 border border-blue-100">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                  {(post.User?.username ||
                    post.User?.name ||
                    "A")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Written by{" "}
                    {post.User?.username || post.User?.name || "Anonymous"}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Passionate writer and technology enthusiast. Sharing
                    knowledge and insights to help developers grow and succeed
                    in their journey.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
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
                      className="text-gray-600 hover:text-blue-600 transition-colors"
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
                      className="text-gray-600 hover:text-blue-600 transition-colors"
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

            {/* Navigation */}
            <div className="mt-8 text-center">
              <Link
                to="/posts"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors group"
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
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Table of Contents */}
            {sections.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
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
                        className="block py-2 px-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors truncate"
                        title={section.title}
                      >
                        {index + 1}. {section.title}
                      </a>
                    ))}
                </nav>
              </div>
            )}

            {/* Author Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                  {(post.User?.username ||
                    post.User?.name ||
                    "A")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {post.User?.username || post.User?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-600">Content Creator</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Technology enthusiast sharing insights and tutorials to help
                developers succeed.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="flex-1 text-center py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Follow
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
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
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                📬 Subscribe to Newsletter
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest articles and tutorials delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Subscribe Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
