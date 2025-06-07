import React, { useState } from "react";
import { motion } from "framer-motion";
import KanbanBoard from "../components/KanbanBoard";
import Calendar from "../components/Calender";
import {
  FaCalendarAlt,
  FaTasks,
  FaChartLine,
  FaBell,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const PlanYourDay = () => {
  const [view, setView] = useState("kanban"); // 'kanban' or 'calendar'
  const [notifications] = useState([
    { id: 1, text: "Team meeting in 30 minutes", type: "reminder" },
    { id: 2, text: "Complete React assignment", type: "task" },
    { id: 3, text: "Review pull requests", type: "work" },
  ]);

  const stats = [
    {
      icon: FaCheckCircle,
      label: "Tasks Completed",
      value: "12",
      color: "text-green-500",
    },
    {
      icon: FaClock,
      label: "Hours Focused",
      value: "6.5",
      color: "text-blue-500",
    },
    {
      icon: FaChartLine,
      label: "Productivity",
      value: "85%",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Plan Your Day
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Organize your tasks, manage your time, and boost your productivity
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
            >
              <stat.icon className={`text-3xl ${stat.color} mb-4`} />
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-1 inline-flex">
            <button
              onClick={() => setView("kanban")}
              className={`px-6 py-2 rounded-lg transition-all ${
                view === "kanban"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaTasks className="inline-block mr-2" />
              Kanban
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-6 py-2 rounded-lg transition-all ${
                view === "calendar"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaCalendarAlt className="inline-block mr-2" />
              Calendar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks/Calendar Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
            >
              {view === "kanban" ? (
                <div className="h-[600px] overflow-auto">
                  <KanbanBoard />
                </div>
              ) : (
                <div className="h-[600px] overflow-auto">
                  <Calendar />
                </div>
              )}
            </motion.div>
          </div>

          {/* Notifications & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <FaBell className="mr-2 text-yellow-500" />
                  Notifications
                </h3>
                <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-gray-700/50 border border-gray-600/50"
                  >
                    <p className="text-sm text-gray-300">{notif.text}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {notif.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {["Add New Task", "Schedule Meeting", "Set Reminder"].map(
                  (action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                    >
                      {action}
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanYourDay;
