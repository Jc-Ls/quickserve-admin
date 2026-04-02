"use client";

import React, { useState, useEffect } from "react";

export default function KitchenDashboard() {
  const [activeTab, setActiveTab] = useState<"dispatch" | "subscriptions">("dispatch");
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Update time every minute so locks release automatically
  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  // --- INTERACTIVE STATE ---
  const [schedules, setSchedules] = useState([
    { id: "1", user: "Jare (Corporate)", timeSlot: "afternoon", meal: "Amala", protein: "Fish", status: "PENDING", date: new Date().toISOString().split('T')[0] },
    { id: "2", user: "Sarah (Student)", timeSlot: "morning", meal: "Jollof Rice", protein: "Chicken", status: "COOKING", date: new Date().toISOString().split('T')[0] },
    { id: "3", user: "Mike (Corporate)", timeSlot: "afternoon", meal: "Poundo", protein: "Turkey", status: "DISPATCHED", rider: "Rider John", date: new Date().toISOString().split('T')[0] },
    { id: "4", user: "Sarah (Student)", timeSlot: "evening", meal: "Pasta", protein: "Beef", status: "PENDING", date: new Date().toISOString().split('T')[0] },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { id: "sub_1", user: "Jare", type: "Corporate", tier: "Premium", cycle: "Weekly", paid: 17500, daysUsed: 2, totalDays: 7, status: "Active" },
    { id: "sub_2", user: "Sarah", type: "Student", tier: "Standard", cycle: "Monthly", paid: 70000, daysUsed: 14, totalDays: 30, status: "Active" },
  ]);

  // --- CORE BUSINESS LOGIC ---

  // 1. Time-Gating: Prevent cooking too early
  const isTimeLocked = (timeSlot: string) => {
    if (timeSlot === "morning" && currentHour < 6) return true; // Unlock at 6 AM
    if (timeSlot === "afternoon" && currentHour < 11) return true; // Unlock at 11 AM
    if (timeSlot === "evening" && currentHour < 16) return true; // Unlock at 4 PM
    return false;
  };

  // 2. State Progression
  const updateMealStatus = (id: string, newStatus: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // 3. Wallet Trap Refund Logic
  const handleCancelSubscription = (subId: string) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    if (window.confirm(`Are you sure you want to cancel ${sub.user}'s subscription?`)) {
      const unusedDays = sub.totalDays - sub.daysUsed;
      const refundAmount = Math.round((sub.paid / sub.totalDays) * unusedDays);
      
      alert(`Subscription Cancelled!\n₦${refundAmount.toLocaleString()} has been refunded directly to ${sub.user}'s QuickServe Wallet.`);
      
      setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status: "Cancelled" } : s));
    }
  };

  const morningMeals = schedules.filter(m => m.timeSlot === "morning");
  const afternoonMeals = schedules.filter(m => m.timeSlot === "afternoon");
  const eveningMeals = schedules.filter(m => m.timeSlot === "evening");

  const getStatusColor = (status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status === "COOKING") return "bg-orange-100 text-orange-800 border-orange-200";
    if (status === "DISPATCHED") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* TABS - Snaps perfectly into your existing Admin Layout */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex p-2 gap-2">
          <button onClick={() => setActiveTab("dispatch")} className={`flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase transition-all ${activeTab === "dispatch" ? "bg-qsDark text-white shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}>
            Today's Dispatch Roster 🚚
          </button>
          <button onClick={() => setActiveTab("subscriptions")} className={`flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase transition-all ${activeTab === "subscriptions" ? "bg-qsDark text-white shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}>
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
                Total Meals: {schedules.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* MORNING */}
              <div className="bg-white rounded-2xl border-t-4 border-t-yellow-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>🌅</span> Breakfast</h3><span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">{morningMeals.length}</span></div>
                <div className="p-4 space-y-4">
                  {morningMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span><span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span></div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {meal.status === "PENDING" && (
                        <button onClick={() => updateMealStatus(meal.id, "COOKING")} disabled={isTimeLocked("morning")} className={`w-full py-2 text-white text-xs font-black rounded-lg transition-colors ${isTimeLocked("morning") ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-black'}`}>
                          {isTimeLocked("morning") ? "🔒 Locked until 6:00 AM" : "Start Cooking 🍳"}
                        </button>
                      )}
                      {meal.status === "COOKING" && <button onClick={() => updateMealStatus(meal.id, "DISPATCHED")} className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With Rider</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* AFTERNOON */}
              <div className="bg-white rounded-2xl border-t-4 border-t-orange-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>☀️</span> Lunch</h3><span className="bg-orange-400 text-white text-xs font-black px-2 py-1 rounded-full">{afternoonMeals.length}</span></div>
                <div className="p-4 space-y-4">
                  {afternoonMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span><span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span></div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {meal.status === "PENDING" && (
                        <button onClick={() => updateMealStatus(meal.id, "COOKING")} disabled={isTimeLocked("afternoon")} className={`w-full py-2 text-white text-xs font-black rounded-lg transition-colors ${isTimeLocked("afternoon") ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-black'}`}>
                          {isTimeLocked("afternoon") ? "🔒 Locked until 11:00 AM" : "Start Cooking 🍳"}
                        </button>
                      )}
                      {meal.status === "COOKING" && <button onClick={() => updateMealStatus(meal.id, "DISPATCHED")} className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With Rider</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* EVENING */}
              <div className="bg-white rounded-2xl border-t-4 border-t-indigo-400 shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><span>🌙</span> Dinner</h3><span className="bg-indigo-400 text-white text-xs font-black px-2 py-1 rounded-full">{eveningMeals.length}</span></div>
                <div className="p-4 space-y-4">
                  {eveningMeals.map(meal => (
                    <div key={meal.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(meal.status)}`}>{meal.status}</span><span className="text-xs font-bold text-gray-400">ID: #{meal.id}</span></div>
                      <h4 className="font-black text-lg text-gray-800 mb-1">{meal.meal} <span className="text-qsOrange text-sm">+ {meal.protein}</span></h4>
                      <p className="text-xs font-bold text-gray-500 mb-4">👤 {meal.user}</p>
                      
                      {meal.status === "PENDING" && (
                        <button onClick={() => updateMealStatus(meal.id, "COOKING")} disabled={isTimeLocked("evening")} className={`w-full py-2 text-white text-xs font-black rounded-lg transition-colors ${isTimeLocked("evening") ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-black'}`}>
                          {isTimeLocked("evening") ? "🔒 Locked until 4:00 PM" : "Start Cooking 🍳"}
                        </button>
                      )}
                      {meal.status === "COOKING" && <button onClick={() => updateMealStatus(meal.id, "DISPATCHED")} className="w-full py-2 bg-qsOrange text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-colors">Assign Rider 🏍️</button>}
                      {meal.status === "DISPATCHED" && <p className="text-xs text-center font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100">With Rider</p>}
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
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className={`border-b border-gray-100 transition-colors ${sub.status === 'Cancelled' ? 'bg-red-50 opacity-60' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 font-bold text-gray-800">{sub.user}</td>
                      <td className="p-4">
                        <span className="block font-black text-qsDark">{sub.type} {sub.tier}</span>
                        <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded font-bold uppercase text-gray-600">{sub.cycle}</span>
                      </td>
                      <td className="p-4 font-black text-green-700">₦{sub.paid.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[100px]">
                          <div className="bg-qsOrange h-2.5 rounded-full" style={{ width: `${(sub.daysUsed / sub.totalDays) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{sub.daysUsed} / {sub.totalDays} Days</span>
                      </td>
                      <td className="p-4 flex gap-2 items-center h-full">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${sub.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                          {sub.status}
                        </span>
                        {sub.status === "Active" && (
                          <button onClick={() => handleCancelSubscription(sub.id)} className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700">
                            Cancel & Refund
                          </button>
                        )}
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
