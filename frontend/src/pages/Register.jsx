import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, User, Mail, Lock, Loader2 } from "lucide-react";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
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
        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const firstError =
                    Object.values(validationErrors)[0]?.[0];

                setError(firstError || "Registration failed.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Registration failed."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">

                <div className="text-center mb-7">
                    <div className="inline-flex items-center justify-center bg-sky-100 p-3 rounded-2xl mb-3">
                        <Wallet size={28} className="text-sky-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Mini<span className="text-sky-500">Wallet</span>
                    </h1>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Create an account
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Get started with your MiniWallet
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Your username"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

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
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

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
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="font-semibold text-sky-600 hover:text-sky-700"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;