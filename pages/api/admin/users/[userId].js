import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { userId } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();

    if (req.method === 'DELETE') {
      // First, get the user to find their email
      const user = await db.collection("users").findOne({ 
        _id: new ObjectId(userId) 
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete user's tasks first
      await db.collection("tasks").deleteMany({ 
        userId: user.email 
      });

      // Then delete the user
      const result = await db.collection("users").deleteOne({ 
        _id: new ObjectId(userId) 
      });

      return res.status(200).json({ 
        success: true, 
        message: "User and associated tasks deleted successfully" 
      });
    }

    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error("Error in user deletion:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}
