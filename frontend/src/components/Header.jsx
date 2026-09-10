import { Menu, Wallet } from "lucide-react";

function Header({ onMenuClick }) {
    return (
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-sky-100">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="bg-sky-100 p-2 rounded-xl">
                        <Wallet
                            size={21}
                            className="text-sky-600"
                        />
                    </div>

                    <span className="text-lg font-bold text-slate-900">
                        Mini<span className="text-sky-500">Wallet</span>
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="p-2 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}

export default Header;