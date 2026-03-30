import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-qsDark text-qsLight h-screen fixed top-0 left-0 flex flex-col shadow-2xl z-50">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <h2 className="text-2xl font-black tracking-wider text-qsOrange">
          QUICK<span className="text-white">SERVE</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-4 px-2">Overview</p>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>📊</span> Dashboard
        </Link>
        <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>📦</span> Live Orders
        </Link>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8 px-2">Super-App Hub</p>
        <Link href="/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>📂</span> Categories
        </Link>
        <Link href="/vendors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>🏪</span> Vendors (Temu-Style)
        </Link>
        <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>🏷️</span> All Products
        </Link>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8 px-2">Admin Control</p>
        <Link href="/special-meals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-qsOrange/10 text-qsOrange hover:bg-qsOrange/20 transition-colors border border-qsOrange/20">
          <span>⭐</span> Special Meals
        </Link>
        <Link href="/riders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>🛵</span> Fleet & Riders
        </Link>
        <Link href="/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <span>👥</span> Consumers
        </Link>
      </nav>

      {/* Footer User Tag */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-qsOrange flex items-center justify-center font-bold text-white shadow-lg">
            JC
          </div>
          <div>
            <p className="text-sm font-bold">Jare's Choice</p>
            <p className="text-xs text-gray-400">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
