"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export default function TodoList() {
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
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="flex mb-4">
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
                  todo.completed ? "line-through text-gray-500" : ""
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
