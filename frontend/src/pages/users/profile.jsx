import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth.jsx";

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If no ID is provided, use the logged-in user's ID
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

    api.users
      .get(userId, token)
      .then((u) => {
        setUser(u);
        setUsername(u.username || "");
        setEmail(u.email || "");
        setBio(u.bio || "");
        setRole(u.role || "user");
      })
      .catch((e) => setError(e.message));
  }, [id, authUser, navigate]);

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const userId = id || authUser?.id;
      const u = await api.users.update(
        userId,
        { username, email, bio, role },
        token
      );
      setUser(u);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-3">
      {error && <div className="text-red-600">{error}</div>}
      <h1 className="text-2xl font-semibold">User Profile</h1>
      <input
        className="w-full border rounded px-3 py-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <select
        className="border rounded px-3 py-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button
        disabled={saving}
        onClick={save}
        className="rounded bg-blue-600 text-white px-3 py-2"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
