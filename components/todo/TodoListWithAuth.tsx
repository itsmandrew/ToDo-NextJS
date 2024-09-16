"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("/api/todos");
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await response.json();
    setTodos([
      ...todos,
      { _id: data.insertedId, title: newTodo, completed: false },
    ]);
    setNewTodo("");
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, completed }),
    });
    setTodos(
      todos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
    );
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl  text-black font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="flex  text-black mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow mr-2"
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <div className="flex items-center">
              <Checkbox
                id={todo._id}
                checked={todo.completed}
                onCheckedChange={(checked) =>
                  toggleTodo(todo._id, checked as boolean)
                }
                className="mr-2"
              />
              <label
                htmlFor={todo._id}
                className={`${
                  todo.completed ? "line-through text-gray-500" : "text-black"
                }`}
              >
                {todo.title}
              </label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TodoListWithAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/signin" });
    router.push(data.url);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-800">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // This will prevent a flash of content before redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-semibold text-gray-900">
                Todo App
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{session.user?.email}</span>
              <Button onClick={handleSignOut}>Sign out</Button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <TodoList />
      </main>
    </div>
  );
}
