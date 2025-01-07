import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const users = await db.collection("users")
      .aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "email",
            foreignField: "userId",
            as: "tasks"
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            taskCount: { $size: "$tasks" }
          }
        }
      ]).toArray();

    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}
