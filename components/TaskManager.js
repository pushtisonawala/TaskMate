import { useState, useEffect } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";

export default function TaskManager() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Fetched tasks:", res.data);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await axios.post('/api/tasks', 
        { title, description, category, priority, dueDate, completed: false },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      const newTask = res.data;
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete('/api/tasks', {
        data: { id: taskId },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      await axios.put('/api/tasks', {
        id: taskId,
        completed: !taskToUpdate.completed
      });
      
      setTasks(tasks.map(task => 
        task._id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task status");
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Task Form */}
      <form onSubmit={addTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="border p-2 rounded"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full rounded mb-4"
          rows="3"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <div key={task._id} 
            className={`border p-4 rounded-lg shadow hover:shadow-md transition-shadow
              ${task.completed ? 'bg-green-50' : 'bg-white'}
              ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : 
                task.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : 
                'border-l-4 border-l-blue-500'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <div className="mt-2 flex gap-2 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">{task.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{task.dueDate}</span>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleComplete(task._id)}
                  className={`${task.completed ? 'bg-green-500' : 'bg-gray-500'} 
                    text-white px-3 py-1 rounded`}
                >
                  {task.completed ? '✓' : '○'}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}