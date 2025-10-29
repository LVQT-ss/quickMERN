import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";
import { useNavigate, useParams } from "react-router-dom";

export default function PostEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [status, setStatus] = useState("draft");
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.posts
      .get(id)
      .then((p) => {
        setTitle(p.title || "");
        setIntroduction(p.introduction || "");
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
  }, [id]);

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
      await api.posts.update(id, { title, introduction, status }, token);
      navigate(`/posts/${id}`);
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
        // Rebind any images targeting the old localKey to the new server key
        setImages((prev) =>
          prev.map((img) =>
            img.sectionKey === (s.localKey || null)
              ? { ...img, section_id: created.id, sectionKey: newLocalKey }
              : img
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSection = async (idx) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const s = sections[idx];
      if (s.id) {
        await api.posts.sections.remove(id, s.id, token);
      }
      // Also drop any images linked to this section in client state
      setImages((prev) => prev.filter((img) => img.section_id !== s.id));
      setSections((prev) => prev.filter((_, i) => i !== idx));
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
        order_index: 1,
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
      } else {
        // Resolve section_id for creation
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
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteImage = async (imgIndex) => {
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Introduction"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Sections</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => addImageToSection(null)}
                className="text-blue-600"
              >
                Add post image
              </button>
              <button
                type="button"
                onClick={addSection}
                className="text-blue-600"
              >
                Add section
              </button>
            </div>
          </div>
          {/* Post-level images editor */}
          {(sectionImages.get("post") || []).map((img) => {
            const imgIndex = images.findIndex((it) => it === img);
            return (
              <div
                key={img.id || `post-${imgIndex}`}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border rounded p-3"
              >
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Image URL"
                  value={img.image_url || ""}
                  onChange={(e) =>
                    updateImage(imgIndex, "image_url", e.target.value)
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Caption"
                  value={img.caption || ""}
                  onChange={(e) =>
                    updateImage(imgIndex, "caption", e.target.value)
                  }
                />
                <div className="flex items-center gap-2">
                  <input
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Order"
                    type="number"
                    value={img.order_index || 1}
                    onChange={(e) =>
                      updateImage(
                        imgIndex,
                        "order_index",
                        Number(e.target.value)
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => saveImage(imgIndex)}
                    className="text-blue-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage(imgIndex)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {sections.map((s, idx) => (
            <div key={s.id || idx} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Section {idx + 1}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => saveSection(idx)}
                    className="text-blue-600 text-sm"
                  >
                    Save section
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(idx)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Section title"
                value={s.title || ""}
                onChange={(e) => updateSection(idx, "title", e.target.value)}
              />
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Section content"
                value={s.content || ""}
                onChange={(e) => updateSection(idx, "content", e.target.value)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Order index"
                type="number"
                value={s.order_index || 1}
                onChange={(e) =>
                  updateSection(idx, "order_index", Number(e.target.value))
                }
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Images</div>
                  <button
                    type="button"
                    onClick={() => addImageToSection(s)}
                    className="text-blue-600 text-sm"
                  >
                    Add image
                  </button>
                </div>
                {(
                  sectionImages.get(
                    s.localKey || (s.id ? `server-${s.id}` : "post")
                  ) || []
                ).map((img) => {
                  const imgIndex = images.findIndex((it) => it === img);
                  return (
                    <div
                      key={img.id || imgIndex}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start"
                    >
                      <input
                        className="border rounded px-3 py-2"
                        placeholder="Image URL"
                        value={img.image_url || ""}
                        onChange={(e) =>
                          updateImage(imgIndex, "image_url", e.target.value)
                        }
                      />
                      <input
                        className="border rounded px-3 py-2"
                        placeholder="Caption"
                        value={img.caption || ""}
                        onChange={(e) =>
                          updateImage(imgIndex, "caption", e.target.value)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <input
                          className="border rounded px-3 py-2 w-full"
                          placeholder="Order"
                          type="number"
                          value={img.order_index || 1}
                          onChange={(e) =>
                            updateImage(
                              imgIndex,
                              "order_index",
                              Number(e.target.value)
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => saveImage(imgIndex)}
                          className="text-blue-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteImage(imgIndex)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          disabled={loading}
          className="rounded bg-blue-600 text-white px-3 py-2"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
