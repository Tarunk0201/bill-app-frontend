import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return alert("Fill all fields");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, form);
      alert("Registered successfully");
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Admin Signup</h2>
        <input
          type="name"
          placeholder="Name"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-500 text-white w-full py-2 rounded">
          Signup
        </button>

        <p className="mt-3 text-sm">
          Already have account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
