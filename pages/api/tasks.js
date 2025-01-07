import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("tasks");

    switch (req.method) {
      case "GET":
        // If the user is an admin, fetch all tasks; otherwise, fetch only their tasks
        const tasks = session.user.role === 'admin'
          ? await collection.find({}).sort({ createdAt: -1 }).toArray()
          : await collection.find({ userId: session.user.email }).sort({ createdAt: -1 }).toArray();
        return res.json(tasks);

      case "POST":
        const { title, description } = req.body;
        const newTask = {
          title,
          description,
          userId: session.user.email,
          completed: false,
          createdAt: new Date()
        };
        const result = await collection.insertOne(newTask);
        return res.status(201).json({ ...newTask, _id: result.insertedId });

      case "PUT":
        const { id, completed } = req.body;
        await collection.updateOne(
          { _id: id, userId: session.user.email },
          { $set: { completed } }
        );
        return res.status(200).json({ success: true });

      case "DELETE":
        await collection.deleteOne({ 
          _id: req.body.id,
          userId: session.user.email 
        });
        return res.status(200).json({ success: true });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}