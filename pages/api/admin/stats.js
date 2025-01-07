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

    const [totalUsers, totalTasks, activeUsersCount] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("tasks").countDocuments(),
      db.collection("users")
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
            $match: {
              "tasks.0": { $exists: true }
            }
          },
          {
            $count: "count"
          }
        ]).toArray()
    ]);

    return res.json({
      totalUsers,
      totalTasks,
      activeUsers: activeUsersCount[0]?.count || 0
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
