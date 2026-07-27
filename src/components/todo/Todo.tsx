import { useEffect, useState } from "react";
import { Plus, Check, X, Trash2, Pencil } from "lucide-react";
import { Panel } from "../common/Panel";
import { toast } from "../common/Toast";

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
  const [newTime, setNewTime] = useState("00:00");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* 로컬 스토리지 접근 불가 처리 */
    }
  }, [todos]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 5);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const updateText = (id: number, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const updateTime = (id: number, time: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, time } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    toast.success("할 일이 삭제되었습니다.", 1500);
  };

  const addTodo = () => {
    const text = newText.trim();
    if (!text) return;
    const time = newTime.trim() || "00:00";
    setTodos((prev) => [...prev, { id: Date.now(), time, text, done: false }]);
    setNewText("");
    setNewTime("00:00");
  };

  // 할 일 목록을 시간순으로 정렬
  const sortedTodos = [...todos].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex h-full w-auto flex-col relative -mx-1.5">
      <div
        className={`shrink-0 flex items-center justify-center pt-1 pb-3 mb-2 relative z-20 transition-all duration-300 ${
          isScrolled ? "shadow-[0_8px_12px_-8px_rgba(0,0,0,0.12)]" : ""
        }`}>
        <h2 className="text-base font-extrabold text-gray-10 tracking-wider">TODO LIST</h2>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-3 custom-scrollbar"
        onScroll={handleScroll}>
        <div className="relative flex flex-col gap-2">
          {sortedTodos.map((todo, index) => {
            const showTime = index === 0 || sortedTodos[index - 1].time !== todo.time;
            return (
              <div
                key={todo.id}
                className="flex w-full min-w-0 items-stretch gap-1.5 relative z-10">
                <div className="w-12 shrink-0 relative flex flex-col items-center justify-center">
                  {showTime ? (
                    <div
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.showPicker()}
                      className="w-full flex items-center justify-center cursor-pointer relative z-10">
                      <span className="text-[12.5px] font-bold text-gray-20 text-center w-full select-none">
                        {todo.time}
                      </span>
                      <input
                        type="time"
                        value={todo.time}
                        onChange={(e) => updateTime(todo.id, e.target.value)}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                      />
                    </div>
                  ) : (
                    <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-[1.5px] border-l-[1.5px] border-dashed border-gray-20 -translate-x-1/2 z-0"></div>
                  )}
                </div>

                <Panel
                  variant="clay"
                  inset
                  className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3.5 py-2.5 my-auto">
                  
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={todo.text}
                      onChange={(e) => updateText(todo.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingId(null);
                      }}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-normal outline-none text-gray-10"
                    />
                  ) : (
                    <div
                      onClick={() => toggleTodo(todo.id)}
                      className={`min-w-0 flex-1 cursor-pointer truncate text-[13px] font-normal select-none transition-colors ${
                        todo.done ? "text-gray-20 line-through" : "text-gray-10"
                      }`}>
                      {todo.text}
                    </div>
                  )}
                  
                  <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setEditingId(todo.id)}
                      className="text-gray-20 hover:text-blue-400 transition-colors"
                      aria-label="수정">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-20 hover:text-red-400 transition-colors"
                      aria-label="삭제">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Panel>
              </div>
            );
          })}

          <div className="flex w-full min-w-0 items-center gap-1.5 mt-1 relative z-10">
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.showPicker()}
              className="w-12 shrink-0 flex items-center justify-center cursor-pointer relative">
              <span className="text-[12.5px] font-bold text-gray-20 text-center w-full select-none">
                {newTime}
              </span>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
              />
            </div>

            <Panel
              variant="clay"
              inset
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3.5 py-2.5">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                }}
                className="min-w-0 flex-1 bg-transparent text-[13px] font-normal outline-none text-gray-10 placeholder:text-gray-20"
                placeholder="새로운 할일을 적고 Enter"
              />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
