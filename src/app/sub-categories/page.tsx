import { db } from "@/db";
import { categories, subCategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm"; // We need this to match IDs together!

export default async function SubCategoriesPage() {
  
  // 📚 TEACHING MOMENT 1: Basic Fetching
  // We need to fetch all parent categories so we can put them inside our <select> dropdown menu.
  const allCategories = await db.select().from(categories);

  // 📚 TEACHING MOMENT 2: The "Left Join"
  // We want to show a list of existing sub-categories. 
  // By using .leftJoin(), we tell the database: "Grab the sub-category, then look at its categoryId, and go fetch the matching Category name from the other table."
  const allSubCategories = await db
    .select({
      id: subCategories.id,
      name: subCategories.name,
      slug: subCategories.slug,
      parentCategoryName: categories.name, // We are stealing the name from the parent table!
    })
    .from(subCategories)
    .leftJoin(categories, eq(subCategories.categoryId, categories.id));

  // 📚 TEACHING MOMENT 3: Server Actions & FormData
  // When you click "Submit" on the form, it sends a 'FormData' object.
  // We extract the values using formData.get("input_name").
  async function createSubCategory(formData: FormData) {
    "use server"; // Security lock: This function will NEVER run on the user's phone, only on the Vercel server.
    
    const name = formData.get("name") as string;
    
    // Forms always send data as Text (strings). But our database expects an Integer (number) for the categoryId.
    // parseInt() converts the text "1" into the mathematical number 1.
    const categoryId = parseInt(formData.get("categoryId") as string);

    if (!name || !categoryId) return; // Safety check: if empty, stop here.

    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

    // Insert the new sub-category into the database
    await db.insert(subCategories).values({ 
        name, 
        slug, 
        categoryId 
    });

    // Refresh the page to show the new data instantly
    revalidatePath("/sub-categories");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-qsDark">Sub-Categories</h1>
        <p className="text-gray-500 mt-2">Break down your main categories into specific storefronts (e.g., Local Market {"->"} Raw Peppers).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: The Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4">Add Sub-Category</h2>
          
          <form action={createSubCategory} className="space-y-4">
            
            {/* 📚 TEACHING MOMENT 4: The Dropdown */}
            {/* We map over the parent categories we fetched earlier to create the options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category</label>
              <select 
                name="categoryId" 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qsOrange bg-white"
              >
                <option value="">-- Select a Category --</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Category Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="e.g., Raw Peppers, Sneakers..." 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qsOrange"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-qsOrange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              + Create Sub-Category
            </button>
          </form>
        </div>

        {/* Right Column: The Data Grid */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Active Sub-Categories ({allSubCategories.length})</h2>
            
            {allSubCategories.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No sub-categories yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {allSubCategories.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col">
                    <span className="text-xs font-bold text-qsOrange mb-1 uppercase tracking-wider">
                      {sub.parentCategoryName}
                    </span>
                    <h3 className="font-bold text-qsDark text-lg">{sub.name}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">/{sub.slug}</p>
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
