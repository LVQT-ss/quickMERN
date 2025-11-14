import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createPostUrl } from "../../utils/helpers";

export default function PostEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [banner, setBanner] = useState("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load post data
    api.posts
      .get(id)
      .then((p) => {
        setTitle(p.title || "");
        setIntroduction(p.introduction || "");
        setBanner(p.banner || "");
        setYoutubeVideoUrl(p.youtubeVideoUrl || "");
        setStatus(p.status || "draft");

        const secs = (
          p.PostSections ||
          p.postSections ||
          p.post_sections ||
          []
        ).map((s) => ({
          id: s.id,
          localKey: `server-${s.id}`,
          title: s.title,
          content: s.content,
          order_index: s.order_index ?? s.orderIndex,
        }));
        setSections(secs);
        
        const imgs = (p.PostImages || p.postImages || p.post_images || []).map(
          (img) => ({
            id: img.id,
            section_id: (img.section_id ?? img.sectionId) || null,
            sectionKey:
              img.section_id ?? img.sectionId
                ? `server-${img.section_id ?? img.sectionId}`
                : "post",
            image_url: (img.image_url ?? img.imageUrl) || "",
            caption: img.caption || "",
            order_index: img.order_index ?? img.orderIndex,
          })
        );
        setImages(imgs);
      })
      .catch((e) => setError(e.message));
  }, [id, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaveSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await api.posts.update(
        id,
        { 
          title, 
          introduction, 
          banner, 
          youtubeVideoUrl: youtubeVideoUrl || null, 
          status
        },
        token
      );
      
      setSaveSuccess("Post updated successfully!");
      setTimeout(() => {
        const fullPost = api.posts.get(id, token).then(fullPost => {
          navigate(createPostUrl(fullPost));
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const localKey = `local-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    setSections((prev) => [
      ...prev,
      { localKey, title: "", content: "", order_index: prev.length + 1 },
    ]);
  };

  const updateSection = (idx, key, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s))
    );
  };

  const saveSection = async (idx) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const s = sections[idx];
      if (s.id) {
        await api.posts.sections.update(
          id,
          s.id,
          { title: s.title, content: s.content, order_index: s.order_index },
          token
        );
        setSaveSuccess(`Section "${s.title}" updated!`);
      } else {
        const created = await api.posts.sections.add(
          id,
          { title: s.title, content: s.content, order_index: s.order_index },
          token
        );
        const newLocalKey = `server-${created.id}`;
        setSections((prev) =>
          prev.map((sec, i) =>
            i === idx ? { ...sec, id: created.id, localKey: newLocalKey } : sec
          )
        );
        setImages((prev) =>
          prev.map((img) =>
            img.sectionKey === (s.localKey || null)
              ? { ...img, section_id: created.id, sectionKey: newLocalKey }
              : img
          )
        );
        setSaveSuccess(`Section "${s.title}" saved!`);
      }
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSection = async (idx) => {
    const s = sections[idx];
    if (!window.confirm(`Delete section "${s.title || 'Untitled'}"?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      if (s.id) {
        await api.posts.sections.remove(id, s.id, token);
      }
      setImages((prev) => prev.filter((img) => img.section_id !== s.id));
      setSections((prev) => prev.filter((_, i) => i !== idx));
      setSaveSuccess("Section deleted!");
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const sectionImages = useMemo(() => {
    const map = new Map();
    for (const img of images) {
      const key =
        img.sectionKey ||
        (img.section_id ? `server-${img.section_id}` : "post");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(img);
    }
    return map;
  }, [images]);

  const addImageToSection = (section) => {
    const sectionKey =
      section?.localKey || (section?.id ? `server-${section.id}` : "post");
    setImages((prev) => [
      ...prev,
      {
        section_id: section?.id || null,
        sectionKey,
        image_url: "",
        caption: "",
        order_index: (prev.filter(img => img.sectionKey === sectionKey).length || 0) + 1,
      },
    ]);
  };

  const updateImage = (imgIndex, key, value) => {
    setImages((prev) =>
      prev.map((img, i) => (i === imgIndex ? { ...img, [key]: value } : img))
    );
  };

  const saveImage = async (imgIndex) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const img = images[imgIndex];
      if (img.id) {
        await api.posts.images.update(
          id,
          img.id,
          {
            caption: img.caption,
            order_index: img.order_index,
            image_url: img.image_url,
          },
          token
        );
        setSaveSuccess("Image updated!");
      } else {
        let section_id = img.section_id || undefined;
        if (
          !section_id &&
          img.sectionKey &&
          img.sectionKey.startsWith("server-")
        ) {
          section_id = Number(img.sectionKey.replace("server-", ""));
        }
        const created = await api.posts.images.add(
          id,
          {
            image_url: img.image_url,
            caption: img.caption,
            order_index: img.order_index,
            section_id,
          },
          token
        );
        setImages((prev) =>
          prev.map((it, i) => (i === imgIndex ? { ...it, id: created.id } : it))
        );
        setSaveSuccess("Image saved!");
      }
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteImage = async (imgIndex) => {
    if (!window.confirm("Delete this image?")) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const img = images[imgIndex];
      if (img.id) {
        await api.posts.images.remove(id, img.id, token);
      }
      setImages((prev) => prev.filter((_, i) => i !== imgIndex));
      setSaveSuccess("Image deleted!");
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/posts" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
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
            <span className="text-gray-900 dark:text-gray-100 font-medium">Edit Post</span>
          </nav>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 px-6 py-8 text-white">
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
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <p className="text-indigo-100 dark:text-indigo-200 mt-1">
                  Update your content and make it even better
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mx-6 mt-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{saveSuccess}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6">
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-lg">
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-500"
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                  placeholder="Enter a compelling title for your post..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Banner Image URL
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                  placeholder="https://example.com/banner-image.jpg"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add a banner image URL to make your post stand out
                </p>
                {banner && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  YouTube Video URL
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add a YouTube video URL to embed a featured video in your post
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Introduction <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all resize-none"
                  placeholder="Write a captivating introduction to hook your readers..."
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Publication Status
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">Draft - Save for later</option>
                  <option value="published">Published - Go live now</option>
                </select>
              </div>
            </div>

            {/* Sections */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-500"
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
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({sections.length}{" "}
                    {sections.length === 1 ? "section" : "sections"})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors inline-flex items-center"
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
                <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
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
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No sections yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Sections help you organize your post content into logical
                    parts
                  </p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
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
                      key={s.id || s.localKey || idx}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-4"
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-700">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-700 text-white font-bold text-sm mr-3">
                            {idx + 1}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Section {idx + 1}
                          </h4>
                          {s.id && (
                            <span className="ml-2 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                              Saved
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveSection(idx)}
                            className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold transition-colors inline-flex items-center text-sm"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSection(idx)}
                            className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold transition-colors inline-flex items-center text-sm"
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
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Section Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Section Title
                          </label>
                          <input
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                            placeholder="Enter section title..."
                            value={s.title}
                            onChange={(e) =>
                              updateSection(idx, "title", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Section Content
                          </label>
                          <textarea
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all resize-none"
                            placeholder="Write your section content here..."
                            value={s.content}
                            onChange={(e) =>
                              updateSection(idx, "content", e.target.value)
                            }
                            rows={6}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Display Order
                          </label>
                          <input
                            className="w-32 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
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
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-500"
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
                              Images (
                              {(
                                sectionImages.get(
                                  s.localKey || (s.id ? `server-${s.id}` : "post")
                                ) || []
                              ).length}
                              )
                            </h5>
                            <button
                              type="button"
                              onClick={() => addImageToSection(s)}
                              className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors inline-flex items-center"
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

                          {(
                            sectionImages.get(
                              s.localKey || (s.id ? `server-${s.id}` : "post")
                            ) || []
                          ).length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              No images added yet
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {(
                                sectionImages.get(
                                  s.localKey || (s.id ? `server-${s.id}` : "post")
                                ) || []
                              ).map((img) => {
                                const imgIndex = images.findIndex((it) => it === img);
                                return (
                                  <div
                                    key={img.id || imgIndex}
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        Image {imgIndex + 1}
                                        {img.id && (
                                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                                            Saved
                                          </span>
                                        )}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => saveImage(imgIndex)}
                                          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-xs font-semibold transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteImage(imgIndex)}
                                          className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold transition-colors"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                    <input
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                                      placeholder="Image URL (e.g., https://example.com/image.jpg)"
                                      value={img.image_url}
                                      onChange={(e) =>
                                        updateImage(
                                          imgIndex,
                                          "image_url",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <input
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                                      placeholder="Caption (optional)"
                                      value={img.caption}
                                      onChange={(e) =>
                                        updateImage(
                                          imgIndex,
                                          "caption",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <input
                                      className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all"
                                      placeholder="Order"
                                      type="number"
                                      value={img.order_index}
                                      onChange={(e) =>
                                        updateImage(
                                          imgIndex,
                                          "order_index",
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  </div>
                                );
                              })}
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
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/posts"
                className="px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-flex items-center"
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
                className="bg-indigo-600 dark:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
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
                    Updating Post...
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
                    {status === "published" ? "Update & Publish" : "Update Draft"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-indigo-600 dark:text-indigo-500 mt-0.5 mr-3"
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
            <div className="text-sm text-indigo-900 dark:text-indigo-200">
              <p className="font-semibold mb-1">Editing Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Save sections individually as you make changes</li>
                <li>Click "Update Draft" to save progress without publishing</li>
                <li>Remember to save each section before updating the main post</li>
                <li>Use the "Saved" badges to track which content is synced</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
