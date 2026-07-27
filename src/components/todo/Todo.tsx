import { useEffect, useState } from "react";
import { Plus, Check, X, Trash2 } from "lucide-react";
import { Panel } from "../common/Panel";

interface TodoItem {
  id: number;
  time: string;
  text: string;
  done: boolean;
}

const initialTodos: TodoItem[] = [];

const STORAGE_KEY = "oasis-todos";

const loadTodos = (): TodoItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialTodos;
    const parsed = JSON.parse(raw) as TodoItem[];
    return Array.isArray(parsed) ? parsed : initialTodos;
  } catch {
    return initialTodos;
  }
};

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* storage unavailable */
    }
  }, [todos]);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const updateText = (id: number, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    if (confirm("모든 할 일을 삭제할까요?")) {
      setTodos([]);
    }
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold ">TODO LIST</h2>
        {todos.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
            aria-label="전체 삭제">
            <Trash2 className="h-3.5 w-3.5" />
            전체 삭제
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="flex flex-col gap-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex w-full min-w-0 items-start gap-3">
              <span className="mt-2 w-12 shrink-0 text-sm font-medium text-text-muted">
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
                  className={`min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted ${
                    todo.done ? "text-text-muted line-through" : ""
                  }`}
                  placeholder="할 일을 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="shrink-0 text-text-muted hover:text-red-500 transition-colors"
                  aria-label="삭제">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Panel>
            </div>
          ))}

          <div className="flex w-full min-w-0 items-start gap-3">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="time-no-ampm mt-2 w-20 shrink-0 bg-transparent p-0 pr-2 text-sm font-medium text-text-muted outline-none"
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
                className="min-w-0 flex-1 bg-transparent text-sm  outline-none placeholder:text-text-muted"
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
