import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Panel } from "../common/Panel";

interface TodoItem {
  id: number;
  time: string;
  text: string;
  done: boolean;
}

const initialTodos: TodoItem[] = [
  { id: 1, time: "12:00", text: "3월 모의고사", done: false },
  { id: 2, time: "14:00", text: "", done: false },
];

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const updateText = (id: number, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const addTodo = () => {
    const text = newText.trim();
    if (!text) return;
    const time = newTime.trim() || "--:--";
    setTodos((prev) => [...prev, { id: Date.now(), time, text, done: false }]);
    setNewText("");
    setNewTime("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-4 text-center text-lg font-semibold text-slate-700">
        TODO LIST
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="flex flex-col gap-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex w-full min-w-0 items-start gap-3">
              <span className="mt-2 w-12 shrink-0 text-sm font-medium text-slate-500">
                {todo.time}
              </span>

              <Panel
                variant="clay"
                inset
                className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-4 py-2">
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    todo.done
                      ? "border-green-50 bg-green-50 text-white"
                      : "border-clay-border/40 bg-transparent text-transparent"
                  }`}>
                  <Check className="h-3.5 w-3.5" />
                </button>

                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => updateText(todo.id, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="할 일을 입력하세요"
                />
              </Panel>
            </div>
          ))}

          <div className="flex w-full min-w-0 items-start gap-3">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="mt-2 w-16 shrink-0 bg-transparent p-0 text-sm font-medium text-slate-500 outline-none"
            />
            <span className="sr-only">시간 선택</span>

            <Panel
              variant="clay"
              inset
              className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-4 py-2">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="새로운 할 일 추가"
              />

              <button
                type="button"
                onClick={addTodo}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-400 text-white transition-colors hover:bg-slate-500">
                <Plus className="h-4 w-4" />
              </button>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
