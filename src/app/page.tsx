import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white max-w-5xl mx-auto p-8">

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          TaskForge AI
        </h1>

        <p className="text-zinc-400 mt-3">
          AI-Powered Productivity Companion
        </p>
      </div>

      <TaskForm />

      <TaskList />

    </main>
  );
}
