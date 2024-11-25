import { connect } from "@/app/lib/ConnectDB";

export const GET = async (req: Request) => {
  try {
    // Parse query parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default to 10 items per page

    // Calculate skip value
    const skip = (page - 1) * limit;

    const db = await connect();
    const userCollection = db?.collection("users");

    // Fetch paginated data
    const users = await userCollection
      ?.find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Fetch the total count of documents
    const totalUsers = await userCollection?.countDocuments();

    // Return paginated response
    return new Response(
      JSON.stringify({
        users,
        totalUsers,
        totalPages: Math.ceil((totalUsers || 0) / limit),
        currentPage: page,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching user list:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching user list" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
};
