import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Trash2,
  GripHorizontal,
  Plus,
  Calendar,
  AlertCircle,
} from "lucide-react";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [
      {
        id: "1",
        content: "Design new landing page",
        priority: "high",
        dueDate: "2025-06-10",
      },
      {
        id: "2",
        content: "Review API documentation",
        priority: "medium",
        dueDate: "2025-06-15",
      },
      {
        id: "5",
        content: "Update user authentication",
        priority: "high",
        dueDate: "2025-06-12",
      },
    ],
    inProgress: [
      {
        id: "3",
        content: "Implement payment gateway",
        priority: "low",
        dueDate: "2025-06-20",
      },
      {
        id: "6",
        content: "Create mobile responsive design",
        priority: "medium",
        dueDate: "2025-06-18",
      },
    ],
    completed: [
      {
        id: "4",
        content: "Setup project repository",
        priority: "medium",
        dueDate: "2025-06-25",
      },
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
    ) {
      return;
    }

    const newTasks = { ...tasks };
    const sourceColumn = Array.from(newTasks[source.droppableId]);
    const destColumn =
      source.droppableId === destination.droppableId
        ? sourceColumn
        : Array.from(newTasks[destination.droppableId]);

    // Remove from source
    const [removed] = sourceColumn.splice(source.index, 1);

    // Add to destination
    destColumn.splice(destination.index, 0, removed);

    newTasks[source.droppableId] = sourceColumn;
    newTasks[destination.droppableId] = destColumn;

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
        return "bg-red-100 text-red-700 border-l-4 border-red-500";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500";
      case "low":
        return "bg-green-100 text-green-700 border-l-4 border-green-500";
      default:
        return "bg-blue-100 text-blue-700 border-l-4 border-blue-500";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "🔵";
    }
  };

  const columnConfig = {
    todo: {
      title: "📋 To Do",
      bgColor: "bg-slate-50",
      headerColor: "bg-blue-500",
    },
    inProgress: {
      title: "🚀 In Progress",
      bgColor: "bg-orange-50",
      headerColor: "bg-orange-500",
    },
    completed: {
      title: "✅ Completed",
      bgColor: "bg-green-50",
      headerColor: "bg-green-500",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Kanban Board
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Organize your workflow efficiently
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {Object.keys(tasks).map((columnId) => (
              <div
                key={columnId}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Column Header */}
                <div className={`${columnConfig[columnId].headerColor} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl text-white">
                        {columnConfig[columnId].title}
                      </h3>
                      <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full font-medium">
                        {tasks[columnId].length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddTask(columnId)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white hover:scale-105"
                      title="Add new task"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Column Content */}
                <div className={`${columnConfig[columnId].bgColor} p-2 sm:p-4`}>
                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] sm:min-h-[300px] space-y-2 sm:space-y-3 p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                          snapshot.isDraggingOver
                            ? "bg-blue-100/50 border-2 border-dashed border-blue-400 shadow-inner"
                            : "bg-transparent"
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
                                className={`group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                                  snapshot.isDragging
                                    ? "shadow-2xl rotate-3 scale-105 border-blue-400 ring-4 ring-blue-100"
                                    : ""
                                } ${getPriorityColor(task.priority)}`}
                              >
                                {/* Task Header */}
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      <GripHorizontal size={16} />
                                    </div>
                                    <span className="font-medium text-gray-800 flex-1 leading-snug">
                                      {task.content}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeTask(task.id, columnId)
                                    }
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-500 ml-2"
                                    title="Delete task"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {/* Task Footer */}
                                <div className="flex justify-between items-center text-sm">
                                  <div className="flex items-center gap-1">
                                    <span>
                                      {getPriorityIcon(task.priority)}
                                    </span>
                                    <span className="font-medium capitalize">
                                      {task.priority}
                                    </span>
                                  </div>
                                  {task.dueDate && (
                                    <div
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                                        isOverdue(task.dueDate)
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {isOverdue(task.dueDate) && (
                                        <AlertCircle size={12} />
                                      )}
                                      <Calendar size={12} />
                                      <span>{formatDate(task.dueDate)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Empty State */}
                        {tasks[columnId].length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            <div className="text-4xl mb-3">📝</div>
                            <p className="font-medium">No tasks yet</p>
                            <p className="text-sm">Add your first task above</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Add Task Modal */}
        {isAddingTask && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setIsAddingTask(false)
            }
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 transform transition-all scale-100 opacity-100">
              {" "}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Add New Task
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Create a task in {columnConfig[addingToColumn]?.title}
                  </p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Task Description *
                  </label>
                  <textarea
                    value={newTask.content}
                    onChange={(e) =>
                      setNewTask({ ...newTask, content: e.target.value })
                    }
                    placeholder="What needs to be done?"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    rows="3"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Priority Level
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTask({
                      content: "",
                      priority: "medium",
                      dueDate: "",
                    });
                  }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 font-medium transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={submitNewTask}
                  disabled={!newTask.content.trim()}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
