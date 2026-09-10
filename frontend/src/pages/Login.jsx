import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock, Loader2 } from "lucide-react";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/login", form);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-sky-100 p-3 rounded-2xl mb-4">
                        <Wallet
                            size={30}
                            className="text-sky-600"
                        />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Mini<span className="text-sky-500">Wallet</span>
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Simple and secure digital wallet
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Welcome back
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-sky-600 hover:text-sky-700"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;