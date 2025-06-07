import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Trash2, GripHorizontal, Plus } from "lucide-react";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "1", content: "Task 1", priority: "high", dueDate: "2025-06-10" },
      { id: "2", content: "Task 2", priority: "medium", dueDate: "2025-06-15" },
    ],
    inProgress: [
      { id: "3", content: "Task 3", priority: "low", dueDate: "2025-06-20" },
    ],
    completed: [
      { id: "4", content: "Task 4", priority: "medium", dueDate: "2025-06-25" },
    ],
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState(null);
  const [newTask, setNewTask] = useState({
    content: "",
    priority: "medium",
    dueDate: "",
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newTasks = { ...tasks };
    const [removed] = newTasks[source.droppableId].splice(source.index, 1);
    newTasks[destination.droppableId].splice(destination.index, 0, removed);
    setTasks(newTasks);
  };

  const handleAddTask = (column) => {
    setIsAddingTask(true);
    setAddingToColumn(column);
  };

  const submitNewTask = () => {
    if (newTask.content.trim()) {
      const taskToAdd = {
        id: Date.now().toString(),
        ...newTask,
      };

      setTasks((prev) => ({
        ...prev,
        [addingToColumn]: [...prev[addingToColumn], taskToAdd],
      }));

      setNewTask({ content: "", priority: "medium", dueDate: "" });
      setIsAddingTask(false);
      setAddingToColumn(null);
    }
  };

  const removeTask = (taskId, column) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId),
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  const columnTitles = {
    todo: { title: "To Do" },
    inProgress: { title: "In Progress" },
    completed: { title: "Completed" },
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-[1600px] mx-auto min-h-[calc(100vh-2rem)]">
        {Object.keys(tasks).map((columnId) => (
          <div
            key={columnId}
            className="flex flex-col h-full bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
              <h3 className="font-semibold text-xl text-white">
                {columnTitles[columnId].title}
                <span className="ml-2 text-sm text-gray-400">
                  ({tasks[columnId].length})
                </span>
              </h3>
              <button
                onClick={() => handleAddTask(columnId)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors hover:text-white"
              >
                <Plus size={20} className="text-gray-400" />
              </button>
            </div>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-4 rounded-lg transition-colors min-h-[200px] ${
                    snapshot.isDraggingOver
                      ? "bg-gray-700/50 border-2 border-blue-500/50 ring-4 ring-blue-500/20"
                      : "bg-gray-800/30"
                  }`}
                >
                  {tasks[columnId].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group mb-4 p-4 rounded-lg bg-gray-700 border border-gray-600 shadow-lg transform transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/30 ${
                            snapshot.isDragging
                              ? "shadow-2xl border-blue-500/50 rotate-2 scale-[1.02] ring-4 ring-blue-500/20"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div
                              {...provided.dragHandleProps}
                              className="flex-1 flex items-center gap-2"
                            >
                              <GripHorizontal
                                size={16}
                                className="text-gray-400"
                              />
                              <span className="text-gray-200">
                                {task.content}
                              </span>
                            </div>
                            <button
                              onClick={() => removeTask(task.id, columnId)}
                              className="p-1 hover:bg-gray-600 rounded"
                            >
                              <Trash2 size={14} className="text-gray-400" />
                            </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-400">
                                {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsAddingTask(false)
          }
        >
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-700 transform transition-all duration-200">
            <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <Plus size={24} className="text-blue-400" />
              Add New Task
            </h3>
            <input
              type="text"
              value={newTask.content}
              onChange={(e) =>
                setNewTask({ ...newTask, content: e.target.value })
              }
              placeholder="Task description"
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autoFocus
            />
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ content: "", priority: "medium", dueDate: "" });
                }}
                className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitNewTask}
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
