// components/TaskItem.js

import { Button, Card, Text } from "@shadcn/ui";

const TaskItem = ({ task, onDelete, onToggle }) => {
  return (
    <Card className="flex justify-between items-center p-4 border-b">
      <div>
        <Text className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
          {task.title}
        </Text>
        <Text className="text-gray-600">{task.description}</Text>
      </div>
      <div>
        <Button
          onClick={() => onToggle(task._id, !task.completed)}
          className={`ml-2 ${task.completed ? "bg-red-500" : "bg-green-500"}`}
        >
          {task.completed ? "Undo" : "Complete"}
        </Button>
        <Button
          onClick={() => onDelete(task._id)}
          className="ml-2 bg-red-500 text-white"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;