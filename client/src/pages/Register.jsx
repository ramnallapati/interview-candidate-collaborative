import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", form);
      login({ ...res.data.user, token: res.data.token });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {error && (
          <p className="bg-red-500 text-white p-2 rounded mb-2">{error}</p>
        )}
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer p-3 rounded border-2 text-center transition-all ${
              form.role === 'candidate' 
                ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="role"
                value="candidate"
                checked={form.role === 'candidate'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="sr-only"
              />
              <div className="font-medium">Candidate</div>
              <div className="text-xs text-gray-400 mt-1">Join interviews</div>
            </label>
            <label className={`cursor-pointer p-3 rounded border-2 text-center transition-all ${
              form.role === 'interviewer' 
                ? 'border-green-500 bg-green-500/20 text-green-400' 
                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="role"
                value="interviewer"
                checked={form.role === 'interviewer'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="sr-only"
              />
              <div className="font-medium">Interviewer</div>
              <div className="text-xs text-gray-400 mt-1">Create rooms</div>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
        >
          Register
        </button>
        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
