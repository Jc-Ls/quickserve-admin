import { db } from "@/db";
import { users } from "@/db/schema";

export default async function AdminDashboard() {
  // THE PLUMBING TEST: Fetching all users from Neon DB
  const allUsers = await db.select().from(users);

  return (
    <main className="min-h-screen bg-qsLight p-8 text-qsDark">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-qsOrange text-white p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold tracking-tight">QuickServe Admin Central</h1>
          <p className="opacity-90 mt-1">Global Ecosystem Dashboard</p>
        </div>

        {/* Database Readout Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">System Status: Database Connected 🟢</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-mono text-sm">
              Total Consumers Registered: {allUsers.length}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
