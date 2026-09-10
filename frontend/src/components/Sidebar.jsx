import { useNavigate, useLocation } from "react-router-dom";
import {
    Wallet,
    LayoutDashboard,
    History,
    LogOut,
    X,
} from "lucide-react";

const NAV_ITEMS = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: History },
];

function Sidebar({ isOpen, onClose, user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-sky-100 flex flex-col ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-sky-100 p-2 rounded-xl">
                            <Wallet size={23} className="text-sky-600" />
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            Mini<span className="text-sky-500">Wallet</span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="md:hidden text-slate-400"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => {
                                    navigate(item.path);
                                    onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                                    active
                                        ? "bg-sky-100 text-sky-700"
                                        : "text-slate-500 hover:bg-sky-50"
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.username || "User"}
                            </p>

                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || ""}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500"
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;