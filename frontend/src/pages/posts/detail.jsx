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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
            Post not found
          </h3>
          <p className="text-gray-600 mb-4">
            The post you're looking for doesn't exist
          </p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Get hero image (first image without section)
  const heroImage = images.find(
    (img) => (img.sectionId ?? img.section_id ?? null) == null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <svg
              className="w-4 h-4 mx-2"
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
            <Link to="/posts" className="hover:text-blue-600 transition-colors">
              Posts
            </Link>
            <svg
              className="w-4 h-4 mx-2"
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
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Hero Image */}
          {heroImage ? (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={(heroImage.imageUrl ?? heroImage.image_url) || ""}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
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

          {/* Title and Meta */}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/posts?category=${category.id}`}
                  className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              {post.status === "draft" && (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
                  Draft
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Date Info */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {(post.User?.name || "A")[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {post.User?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={toggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  liked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
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
            </div>

            {/* Introduction */}
            {post.introduction && (
              <div className="mt-8">
                <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2">
                  {post.introduction}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        {sections.length > 0 && (
          <div className="space-y-8">
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
                      (img.sectionId ?? img.section_id ?? null) === section.id
                  )
                  .sort(
                    (a, b) =>
                      (a.orderIndex ?? a.order_index ?? 0) -
                      (b.orderIndex ?? b.order_index ?? 0)
                  );

                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-lg shadow-md p-8"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      {section.title}
                    </h2>
                    <div className="prose prose-lg max-w-none mb-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>

                    {/* Section Images */}
                    {sectionImages.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {sectionImages.map((img) => (
                          <div key={img.id} className="group">
                            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                              <img
                                src={(img.imageUrl ?? img.image_url) || ""}
                                alt={img.caption || "Section image"}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {img.caption && (
                              <p className="text-sm text-gray-600 italic mt-2 text-center">
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

        {/* Additional Post Images (without sections) */}
        {images.filter(
          (img) =>
            (img.sectionId ?? img.section_id ?? null) == null &&
            img.id !== heroImage?.id
        ).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {images
                .filter(
                  (img) =>
                    (img.sectionId ?? img.section_id ?? null) == null &&
                    img.id !== heroImage?.id
                )
                .sort(
                  (a, b) =>
                    (a.orderIndex ?? a.order_index ?? 0) -
                    (b.orderIndex ?? b.order_index ?? 0)
                )
                .map((img) => (
                  <div key={img.id} className="group">
                    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={(img.imageUrl ?? img.image_url) || ""}
                        alt={img.caption || "Gallery image"}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {img.caption && (
                      <p className="text-sm text-gray-600 italic mt-2 text-center">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Share this post
            </h3>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Posts */}
        <div className="mt-8 text-center">
          <Link
            to="/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
