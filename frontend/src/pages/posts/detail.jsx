import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api.posts.get(id), api.likes.count(id)])
      .then(([p, c]) => {
        if (!active) return;
        setPost(p);
        setCount(c.count || 0);
      })
      .catch((err) => setError(err.message));
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
    } catch (err) {
      setError(err.message);
    }
  };

  if (!post) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-700">{post.introduction}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded bg-blue-600 text-white px-3 py-1"
        >
          Like
        </button>
        <span>{count}</span>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Sections</h2>
        {(
          post.PostSections ||
          post.postSections ||
          post.post_sections ||
          []
        ).map((s) => (
          <div key={s.id} className="border rounded p-3 mb-2">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {s.content}
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images
                .filter(
                  (img) => (img.sectionId ?? img.section_id ?? null) === s.id
                )
                .sort(
                  (a, b) =>
                    (a.orderIndex ?? a.order_index ?? 0) -
                    (b.orderIndex ?? b.order_index ?? 0)
                )
                .map((img) => (
                  <div key={img.id} className="border rounded p-2">
                    <img
                      src={(img.imageUrl ?? img.image_url) || ""}
                      alt={img.caption || "image"}
                      className="w-full h-auto rounded"
                    />
                    {img.caption && (
                      <div className="text-xs text-gray-600 mt-1">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Post Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {images
            .filter((img) => (img.sectionId ?? img.section_id ?? null) == null)
            .sort(
              (a, b) =>
                (a.orderIndex ?? a.order_index ?? 0) -
                (b.orderIndex ?? b.order_index ?? 0)
            )
            .map((img) => (
              <div key={img.id} className="border rounded p-2">
                <img
                  src={(img.imageUrl ?? img.image_url) || ""}
                  alt={img.caption || "image"}
                  className="w-full h-auto rounded"
                />
                {img.caption && (
                  <div className="text-xs text-gray-600 mt-1">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
