"use client";

import React, { useState } from "react";

export default function KitchenDashboard() {
  const [activeTab, setActiveTab] = useState<"dispatch" | "subscriptions">("dispatch");

  // --- MOCK DATA (Matches the Drizzle Database Schema exactly) ---
  const mockSchedules = [
    { id: "1", user: "Jare (Corporate)", timeSlot: "afternoon", meal: "Amala", protein: "Fish", status: "PENDING", date: new Date().toISOString().split('T')[0] },
    { id: "2", user: "Sarah (Student)", timeSlot: "morning", meal: "Jollof Rice", protein: "Chicken", status: "COOKING", date: new Date().toISOString().split('T')[0] },
    { id: "3", user: "Mike (Corporate)", timeSlot: "afternoon", meal: "Poundo", protein: "Turkey", status: "DISPATCHED", rider: "Rider John", date: new Date().toISOString().split('T')[0] },
    { id: "4", user: "Sarah (Student)", timeSlot: "evening", meal: "Pasta", protein: "Beef", status: "PENDING", date: new Date().toISOString().split('T')[0] },
  ];

  const mockSubscriptions = [
    { id: "sub_1", user: "Jare", type: "Corporate", tier: "Premium", cycle: "Weekly", paid: "₦17,500", daysUsed: 2, totalDays: 7, status: "Active" },
    { id: "sub_2", user: "Sarah", type: "Student", tier: "Standard", cycle: "Monthly", paid: "₦70,000", daysUsed: 14, totalDays: 30, status: "Active" },
  ];

  // Helper to group daily schedules by time slot
  const morningMeals = mockSchedules.filter(m => m.timeSlot === "morning");
  const afternoonMeals = mockSchedules.filter(m => m.timeSlot === "afternoon");
  const eveningMeals = mockSchedules.filter(m => m.timeSlot === "evening");

  const getStatusColor = (status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status === "COOKING") return "bg-orange-100 text-orange-800 border-orange-200";
    if (status === "DISPATCHED") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* ADMIN TOP NAVIGATION */}
      <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-qsOrange tracking-widest uppercase">QuickServe Admin</h1>
            <p className="text-xs text-gray-400 font-bold">Special Meals Command Center</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Refresh Data 🔄
            </button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[72px] z-10">
        <div className="max-w-6xl mx-auto flex p-2 gap-2">
          <button 
            onClick={() => setActiveTab("dispatch")}
            className={`flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase transition-all ${activeTab === "dispatch" ? "bg-qsDark text-white shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}
          >
            Today's Dispatch Roster 🚚
          </button>
          <button 
            onClick={() => setActiveTab("subscriptions")}
            className={`flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase transition-all ${activeTab === "subscriptions" ? "bg-qsDark text-white shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}
          >
            Active Subscriptions 📜
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 mt-4">
        
        {/* ================= TAB 1: DISPATCH ROSTER ================= */}
        {activeTab === "dispatch" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Today's Kitchen Flow</h2>
                <p className="text-gray-500 text-sm font-bold">{new Date().toDateString()}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-black border border-green-200">
                Total Meals Today: {mockSchedules.length}
              </div>
            </div>

            {/* THE KITCHEN COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* MORNING COLUMN */}
              <div className="bg-white rounded-2xl border-t-4 border-t-yellow-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>🌅</span> Breakfast</h3>
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">{morningMeals.length}</span>
                </div>
                <div className="p-4 space-y-4">
                  {morningMeals.length === 0 && <p className="text-center text-sm text-gray-400 font-bold py-6">No breakfast orders today.</p>}
                  {morningMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span>
                        <span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span>
                      </div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {/* ACTION BUTTONS BASED ON STATUS */}
                      {meal.status === "PENDING" && <button className="w-full py-2 bg-gray-800 text-white text-xs font-black rounded-lg hover:bg-black transition-colors">Start Cooking 🍳</button>}
                      {meal.status === "COOKING" && <button className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors shadow-[0_4px_10px_rgba(234,88,12,0.3)]">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With {meal.rider}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* AFTERNOON COLUMN */}
              <div className="bg-white rounded-2xl border-t-4 border-t-orange-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>☀️</span> Lunch</h3>
                  <span className="bg-orange-400 text-white text-xs font-black px-2 py-1 rounded-full">{afternoonMeals.length}</span>
                </div>
                <div className="p-4 space-y-4">
                  {afternoonMeals.length === 0 && <p className="text-center text-sm text-gray-400 font-bold py-6">No lunch orders today.</p>}
                  {afternoonMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span>
                        <span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span>
                      </div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {meal.status === "PENDING" && <button className="w-full py-2 bg-gray-800 text-white text-xs font-black rounded-lg hover:bg-black transition-colors">Start Cooking 🍳</button>}
                      {meal.status === "COOKING" && <button className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors shadow-[0_4px_10px_rgba(234,88,12,0.3)]">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With {meal.rider}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* EVENING COLUMN */}
              <div className="bg-white rounded-2xl border-t-4 border-t-indigo-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>🌙</span> Dinner</h3>
                  <span className="bg-indigo-400 text-white text-xs font-black px-2 py-1 rounded-full">{eveningMeals.length}</span>
                </div>
                <div className="p-4 space-y-4">
                  {eveningMeals.length === 0 && <p className="text-center text-sm text-gray-400 font-bold py-6">No dinner orders today.</p>}
                  {eveningMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span>
                        <span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span>
                      </div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {meal.status === "PENDING" && <button className="w-full py-2 bg-gray-800 text-white text-xs font-black rounded-lg hover:bg-black transition-colors">Start Cooking 🍳</button>}
                      {meal.status === "COOKING" && <button className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors shadow-[0_4px_10px_rgba(234,88,12,0.3)]">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With {meal.rider}</p>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: ACTIVE SUBSCRIPTIONS ================= */}
        {activeTab === "subscriptions" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Subscription Ledger</h2>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-widest">
                    <th className="p-4">Subscriber</th>
                    <th className="p-4">Plan Details</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Credit Usage</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {mockSubscriptions.map(sub => (
                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{sub.user}</td>
                      <td className="p-4">
                        <span className="block font-black text-qsDark">{sub.type} {sub.tier}</span>
                        <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded font-bold uppercase text-gray-600">{sub.cycle}</span>
                      </td>
                      <td className="p-4 font-black text-green-700">{sub.paid}</td>
                      <td className="p-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[100px]">
                          <div className="bg-qsOrange h-2.5 rounded-full" style={{ width: `${(sub.daysUsed / sub.totalDays) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{sub.daysUsed} / {sub.totalDays} Days</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 border border-green-200 text-[10px] font-black uppercase px-2 py-1 rounded-md">{sub.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
