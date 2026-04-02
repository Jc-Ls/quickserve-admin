import { db } from "@/db";
import { vendors, categories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export default async function VendorsPage() {
  
  // 1. Fetching categories for the dropdown
  const allCategories = await db.select().from(categories);

  // 2. Fetching vendors and joining their Category Name
  const allVendors = await db
    .select({
      id: vendors.id,
      brandName: vendors.brandName,
      email: vendors.email,
      kycStatus: vendors.kycStatus,
      categoryName: categories.name,
    })
    .from(vendors)
    .leftJoin(categories, eq(vendors.categoryId, categories.id));

  // 📚 TEACHING MOMENT 1: Creating a Test Vendor
  // Normally, vendors register themselves via the mobile app. 
  // But for testing your MVP, we are giving you (the Admin) the power to manually onboard them.
  async function createVendor(formData: FormData) {
    "use server";
    
    const brandName = formData.get("brandName") as string;
    const email = formData.get("email") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);

    if (!brandName || !email || !categoryId) return;

    // We insert a dummy password for now since the Admin is creating them manually
    await db.insert(vendors).values({ 
        brandName, 
        email, 
        categoryId,
        passwordHash: "admin_created_dummy_hash" 
    });

    revalidatePath("/vendors");
  }

  // 📚 TEACHING MOMENT 2: The "Update" Mutation (KYC Approval)
  // How do we tell the database exactly WHICH vendor to approve? 
  // We pass the vendorId from a hidden input in the form.
  async function approveKyc(formData: FormData) {
    "use server";
    const vendorId = parseInt(formData.get("vendorId") as string);
    if (!vendorId) return;

    // The logic: Update the 'vendors' table. Set 'kycStatus' to 'Approved'. 
    // WHERE? Only where the vendor's ID matches the one we clicked!
    await db.update(vendors)
            .set({ kycStatus: "Approved" })
            .where(eq(vendors.id, vendorId));

    revalidatePath("/vendors");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-qsDark">Vendors Hub</h1>
        <p className="text-gray-500 mt-2">Onboard new businesses and manage KYC approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Manual Onboarding Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4">Manual Onboarding</h2>
          
          <form action={createVendor} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brand Name</label>
              <input type="text" name="brandName" required placeholder="e.g., Iya Basira Food" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qsOrange" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" required placeholder="vendor@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qsOrange" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select name="categoryId" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qsOrange bg-white">
                <option value="">-- Select Category --</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="w-full bg-qsDark text-white font-bold py-3 rounded-lg hover:bg-black transition-colors">
              Add Vendor
            </button>
          </form>
        </div>

        {/* Right Column: The Vendor Grid */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Registered Vendors ({allVendors.length})</h2>
            
            {allVendors.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No vendors onboarded yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {allVendors.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-qsDark text-lg">{v.brandName}</h3>
                      <p className="text-sm text-gray-500">{v.email}</p>
                      <span className="inline-block mt-2 text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {v.categoryName || "No Category"}
                      </span>
                    </div>
                    
                    {/* The KYC Approval Section */}
                    <div className="flex flex-col items-end gap-2">
                      {v.kycStatus === "Approved" ? (
                        <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                          ✅ Approved
                        </span>
                      ) : (
                        <form action={approveKyc}>
                          {/* 📚 TEACHING MOMENT 3: The Hidden Input */}
                          {/* This is how the button knows which vendor to approve without the user typing anything */}
                          <input type="hidden" name="vendorId" value={v.id} />
                          <button type="submit" className="bg-qsOrange text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                            Approve KYC
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
