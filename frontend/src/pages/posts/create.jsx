import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import { useNavigate, Link } from "react-router-dom";
import { createPostUrl } from "../../utils/helpers";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [banner, setBanner] = useState("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.categories
      .list()
      .then(setCategories)
      .catch((e) => setError(e.message));
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const post = await api.posts.create(
        { title, introduction, banner, youtubeVideoUrl: youtubeVideoUrl || null, status, category_ids: selected },
        token
      );
      for (const [index, s] of sections.entries()) {
        const sectionPayload = {
          title: s.title,
          content: s.content,
          order_index: Number.isFinite(s.order_index)
            ? s.order_index
            : index + 1,
        };
        const createdSection = await api.posts.sections.add(
          post.id,
          sectionPayload,
          token
        );
        if (Array.isArray(s.images)) {
          for (const [i, img] of s.images.entries()) {
            const imagePayload = {
              image_url: img.image_url,
              caption: img.caption || "",
              order_index: Number.isFinite(img.order_index)
                ? img.order_index
                : i + 1,
              section_id: createdSection.id,
            };
            await api.posts.images.add(post.id, imagePayload, token);
          }
        }
      }
      // Fetch full post data to get category for URL
      const fullPost = await api.posts.get(post.id, token);
      navigate(createPostUrl(fullPost));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCat = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { title: "", content: "", order_index: prev.length + 1, images: [] },
    ]);
  };

  const updateSection = (idx, key, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s))
    );
  };

  const removeSection = (idx) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const addImageToSection = (sIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              images: [
                ...(s.images || []),
                {
                  image_url: "",
                  caption: "",
                  order_index: (s.images?.length || 0) + 1,
                },
              ],
            }
          : s
      )
    );
  };

  const updateImageInSection = (sIdx, imgIdx, key, value) => {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s;
        const imgs = (s.images || []).map((img, j) =>
          j === imgIdx ? { ...img, [key]: value } : img
        );
        return { ...s, images: imgs };
      })
    );
  };

  const removeImageFromSection = (sIdx, imgIdx) => {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s;
        return {
          ...s,
          images: (s.images || []).filter((_, j) => j !== imgIdx),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500">
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
            <span className="text-gray-900 font-medium">Create New Post</span>
          </nav>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center">
              <svg
                className="w-12 h-12 mr-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div>
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <p className="text-blue-100 mt-1">
                  Share your thoughts with the world
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6">
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

          {/* Form */}
          <form onSubmit={submit} className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Basic Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter a compelling title for your post..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/banner-image.jpg"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Add a banner image URL to make your post stand out
                </p>
                {banner && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview:
                    </p>
                    <img
                      src={banner}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Add a YouTube video URL to embed a featured video in your post
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Introduction <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write a captivating introduction to hook your readers..."
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publication Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft - Save for later</option>
                    <option value="published">Published - Go live now</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-32 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No categories available
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((c) => (
                          <label
                            key={c.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selected.includes(c.id)}
                              onChange={() => toggleCat(c.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {c.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {selected.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.map((id) => {
                        const cat = categories.find((c) => c.id === id);
                        return cat ? (
                          <span
                            key={id}
                            className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full"
                          >
                            {cat.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
                  Content Sections
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({sections.length}{" "}
                    {sections.length === 1 ? "section" : "sections"})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
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
                  Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-4"
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No sections yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Sections help you organize your post content into logical
                    parts
                  </p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
                    Add Your First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-300 rounded-lg p-6 space-y-4"
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm mr-3">
                            {idx + 1}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Section {idx + 1}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="text-red-600 hover:text-red-700 font-semibold transition-colors inline-flex items-center"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>

                      {/* Section Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Section Title
                          </label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter section title..."
                            value={s.title}
                            onChange={(e) =>
                              updateSection(idx, "title", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Section Content
                          </label>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Write your section content here..."
                            value={s.content}
                            onChange={(e) =>
                              updateSection(idx, "content", e.target.value)
                            }
                            rows={6}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Display Order
                          </label>
                          <input
                            className="w-32 border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Order"
                            type="number"
                            value={s.order_index}
                            onChange={(e) =>
                              updateSection(
                                idx,
                                "order_index",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-blue-600"
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
                              Images ({(s.images || []).length})
                            </h5>
                            <button
                              type="button"
                              onClick={() => addImageToSection(idx)}
                              className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors inline-flex items-center"
                            >
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Add Image
                            </button>
                          </div>

                          {(s.images || []).length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No images added yet
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {(s.images || []).map((img, j) => (
                                <div
                                  key={j}
                                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600">
                                      Image {j + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeImageFromSection(idx, j)
                                      }
                                      className="text-red-600 hover:text-red-700 text-xs font-semibold transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                                    value={img.image_url}
                                    onChange={(e) =>
                                      updateImageInSection(
                                        idx,
                                        j,
                                        "image_url",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Caption (optional)"
                                    value={img.caption}
                                    onChange={(e) =>
                                      updateImageInSection(
                                        idx,
                                        j,
                                        "caption",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Order"
                                    type="number"
                                    value={img.order_index}
                                    onChange={(e) =>
                                      updateImageInSection(
                                        idx,
                                        j,
                                        "order_index",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                to="/posts"
                className="px-6 py-3 text-gray-700 font-semibold hover:text-gray-900 transition-colors inline-flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Post...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {status === "published" ? "Publish Post" : "Save Draft"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Writing Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Add a banner image to make your post visually appealing</li>
                <li>
                  Break your content into logical sections for better
                  readability
                </li>
                <li>Use descriptive titles that tell readers what to expect</li>
                <li>Add images to make your post more engaging and visual</li>
                <li>Save as draft to preview before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
