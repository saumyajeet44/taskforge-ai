"use client";

import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const completedTasks = tasks.filter(
  (task) => task.isCompleted
).length;

const productivityScore =
  tasks.length === 0
    ? 0
    : Math.round(
        (completedTasks / tasks.length) * 100
      );
      const pendingTasks =
  tasks.length - completedTasks;
  const overdueTasks = tasks.filter(
  (task) =>
    !task.isCompleted &&
    new Date(task.deadline) < new Date()
).length;
  const markComplete = async (id: string) => {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
  });

  window.location.reload();
};
  

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
     .then((data) => {
  const sorted = data.sort(
    (a: any, b: any) => {
      const order: any = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
      };

      return (
        order[a.priority] -
        order[b.priority]
      );
    }
  );

  setTasks(sorted);
});
      
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Your Tasks
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-lg">
  <p>Overdue</p>
  <h3 className="text-2xl font-bold text-red-500">
    {overdueTasks}
  </h3>
</div>

  <div className="bg-zinc-800 p-4 rounded-xl">
    <p>Total Tasks</p>
    <h3 className="text-2xl font-bold">
      {tasks.length}
    </h3>
  </div>

  <div className="bg-zinc-800 p-4 rounded-xl">
    <p>Completed</p>
    <h3 className="text-2xl font-bold text-green-400">
      {completedTasks}
    </h3>
  </div>

  <div className="bg-zinc-800 p-4 rounded-xl">
    <p>Pending</p>
    <h3 className="text-2xl font-bold text-yellow-400">
      {pendingTasks}
    </h3>
  </div>

  <div className="bg-zinc-800 p-4 rounded-xl">
    <p>Productivity</p>
    <h3 className="text-2xl font-bold text-blue-400">
      {productivityScore}%
    </h3>
  </div>

</div>
      <p className="mb-4 text-green-400 font-semibold">
  Productivity Score: {productivityScore}/100
</p>
<div className="bg-purple-900/30 border border-purple-500 p-4 rounded-xl mb-6">
  <h3 className="font-bold text-purple-300 mb-2">
    🤖 AI Recommendation
  </h3>

  {overdueTasks > 0 ? (
    <p>
      You have {overdueTasks} overdue task(s).
      Complete them first.
    </p>
  ) : pendingTasks > 5 ? (
    <p>
      You have many pending tasks.
      Focus on HIGH priority tasks first.
    </p>
  ) : productivityScore > 80 ? (
    <p>
      Great job! Your productivity is excellent.
    </p>
  ) : (
    <p>
      Keep completing tasks daily to improve
      your productivity score.
    </p>
  )}
</div>
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setFilter("ALL")}
    className="bg-zinc-700 px-3 py-1 rounded"
  >
    All
  </button>

  <button
    onClick={() => setFilter("PENDING")}
    className="bg-yellow-600 px-3 py-1 rounded"
  >
    Pending
  </button>

  <button
    onClick={() => setFilter("COMPLETED")}
    className="bg-green-600 px-3 py-1 rounded"
  >
    Completed
  </button>
</div>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks
  .filter((task) => {
    if (filter === "PENDING")
      return !task.isCompleted;

    if (filter === "COMPLETED")
      return task.isCompleted;

    return true;
  })
  .map((task) => (
            <div
  key={task.id}
  className="border border-zinc-700 p-5 rounded-2xl shadow-lg bg-zinc-900 hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300"
>
              <h3 className="font-bold text-xl text-white mb-2">
                {task.title}
              </h3>

              <p>{task.description}</p>

              <p className="mt-2">
                <strong>Deadline:</strong>{" "}
                {new Date(task.deadline).toLocaleDateString()}
              </p>

              <p
  className={`mt-2 font-semibold ${
    task.priority === "HIGH"
      ? "text-red-500"
      : task.priority === "MEDIUM"
      ? "text-yellow-500"
      : "text-green-500"
  }`}
>
  Priority: {task.priority}
</p>

              <p className="mt-2">
  <strong>Status:</strong>{" "}
  {task.isCompleted ? "✅ Completed" : "⏳ Pending"}
</p>
{!task.isCompleted &&
  new Date(task.deadline) < new Date() && (
    <p className="text-red-500 font-bold mt-2">
      ⚠️ Overdue
    </p>
)}
{!task.isCompleted &&
  new Date(task.deadline) > new Date() &&
  new Date(task.deadline).getTime() - new Date().getTime() <
    3 * 24 * 60 * 60 * 1000 && (
    <p className="text-yellow-400 font-bold mt-2">
      ⚠️ Due Soon
    </p>
)}
{!task.isCompleted && (
  <button
    onClick={() => markComplete(task.id)}
    className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
  >
    Mark Complete
  </button>
)}
<button
  onClick={async () => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }}
  className="bg-red-600 text-white px-3 py-1 rounded mt-2 ml-2"
>
  Delete Task
</button>
<p className="mt-2">
  <strong>AI Reason:</strong> {task.aiReasoning}
</p>
              <div className="mt-3">
                <strong>Task Breakdown:</strong>

                <ul className="list-disc ml-6 mt-2">
                  {JSON.parse(task.aiBreakdown).map(
                    (step: string, index: number) => (
                      <li key={index}>{step}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}