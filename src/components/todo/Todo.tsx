import { useEffect, useState, useRef } from "react";
import { Check, Trash2, Pencil } from "lucide-react";
import { Panel } from "../common/Panel";
import { toast } from "../common/Toast";
import { TimePicker } from "./TimePicker";
import { useAuth } from "../../contexts/AuthContext";
import { RestrictedArea } from "../common/RestrictedArea";

interface TodoItem {
  id: number;
  time: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = "oasis-todos";

const initialTodos: TodoItem[] = [];

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

export const Todo = () => {
  const { isAuthenticated } = useAuth();
  const isGuest = !isAuthenticated;
  const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
  const [newTime, setNewTime] = useState("--:--");
  const [newText, setNewText] = useState("");
  const [editData, setEditData] = useState<{ id: number; text: string; time: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openPickerId, setOpenPickerId] = useState<number | "new" | null>(null);
  const [pickerAnchorEl, setPickerAnchorEl] = useState<HTMLElement | null>(null);
  const timeRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    toast.success("할 일이 삭제되었습니다.", 1500);
  };



  const addTodo = () => {
    if (newTime === "--:--") {
      toast.error("할 일의 시간을 선택하고 추가해주세요.", 3000);
      return;
    }
    if (!newText.trim()) {
      toast.error("할 일을 입력해주세요.", 3000);
      return;
    }
    setTodos((prev) => [...prev, { id: Date.now(), time: newTime, text: newText, done: false }]);
    setNewText("");
    setNewTime("--:--");
    toast.success("할 일이 추가되었습니다.", 1500);
  };

  // 할 일 목록을 시간순으로 정렬
  const sortedTodos = [...todos].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <RestrictedArea
      isRestricted={isGuest}
      className="h-full"
      tooltipText={
        <span className="text-text-muted">
          로그인 후 이용할 수 있습니다
        </span>
      }>
      <div className="flex h-full w-auto flex-col relative -mx-1.5">
      <div
        className={`shrink-0 flex items-center justify-center pt-1 pb-3 mb-2 relative z-20 transition-all duration-300 ${
          isScrolled ? "shadow-[0_8px_12px_-8px_rgba(0,0,0,0.12)]" : ""
        }`}>
        <h2 className="text-base font-extrabold text-text tracking-wider">TODO LIST</h2>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-3 custom-scrollbar"
        onScroll={handleScroll}>
        <div className="relative flex flex-col gap-2">
          {sortedTodos.map((todo, index) => {
            const isEditingThis = editData?.id === todo.id;
            const isFirstTimeGroup = index === 0 || sortedTodos[index - 1].time !== todo.time;
            const showTime = isFirstTimeGroup || isEditingThis;
            
            return (
              <div
                key={todo.id}
                className="flex w-full min-w-0 items-stretch gap-1.5 relative z-10">
                <div className="w-12 shrink-0 relative flex flex-col items-center justify-center">
                  {showTime ? (
                    <div
                      ref={(el) => { timeRefs.current[todo.id] = el; }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        if (!isEditingThis) return; // 수정 모드일 때만 드롭다운 열기
                        setOpenPickerId(todo.id);
                        setPickerAnchorEl(e.currentTarget);
                      }}
                      className={`w-full flex items-center justify-center relative z-10 ${
                        isEditingThis ? "cursor-pointer" : "cursor-default"
                      }`}>
                      <span
                        className={`text-[12.5px] font-bold text-center w-full select-none transition-colors ${
                          isEditingThis
                            ? "text-primary hover:brightness-110"
                            : "text-text-muted"
                        }`}>
                        {isEditingThis && editData ? editData.time : todo.time}
                      </span>
                      {openPickerId === todo.id && (
                        <TimePicker
                          value={isEditingThis && editData ? editData.time : todo.time}
                          onChange={(val) => setEditData(prev => prev ? { ...prev, time: val } : prev)}
                          onClose={() => { setOpenPickerId(null); setPickerAnchorEl(null); }}
                          anchorEl={pickerAnchorEl}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-[1.5px] border-l-[1.5px] border-dashed border-gray-20 -translate-x-1/2 z-0"></div>
                  )}
                </div>

                <Panel
                  variant="clay"
                  inset
                  className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3.5 py-2.5 my-auto">
                  
                  {isEditingThis && editData ? (
                    <input
                      type="text"
                      value={editData.text}
                      onChange={(e) => setEditData(prev => prev ? { ...prev, text: e.target.value } : prev)}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-normal outline-none text-text"
                    />
                  ) : (
                    <div
                      onClick={() => toggleTodo(todo.id)}
                      className={`min-w-0 flex-1 cursor-pointer truncate text-[13px] font-normal select-none transition-colors ${
                        todo.done ? "text-text-muted line-through opacity-40" : "text-text"
                      }`}>
                      {todo.text}
                    </div>
                  )}
                  
                  <div className={`shrink-0 flex items-center gap-2 transition-opacity ${isEditingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {isEditingThis && editData ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTodos(todos.map(t => t.id === editData.id ? { ...t, text: editData.text, time: editData.time } : t));
                          setEditData(null);
                          toast.success("할 일이 수정되었습니다.", 1500);
                        }}
                        className="text-text-muted hover:text-blue-400 transition-colors"
                        aria-label="저장">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditData({ id: todo.id, text: todo.text, time: todo.time })}
                        className="text-text-muted hover:text-blue-400 transition-colors"
                        aria-label="수정">
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-text-muted hover:text-red-400 transition-colors"
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
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                setOpenPickerId("new");
                setPickerAnchorEl(e.currentTarget);
              }}
              className="w-12 shrink-0 flex items-center justify-center cursor-pointer relative z-10">
              <span className="text-[12.5px] font-bold text-text-muted text-center w-full select-none hover:text-text transition-colors">
                {newTime}
              </span>
              {openPickerId === "new" && (
                <TimePicker
                  value={newTime === "--:--" ? "09:00" : newTime}
                  onChange={(val) => setNewTime(val)}
                  onClose={() => { setOpenPickerId(null); setPickerAnchorEl(null); }}
                  anchorEl={pickerAnchorEl}
                />
              )}
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
                className="min-w-0 flex-1 bg-transparent text-[13px] font-normal outline-none text-text placeholder:text-text-muted"
                placeholder="새로운 할일을 적고 Enter"
              />
            </Panel>
          </div>
        </div>
      </div>
      </div>
    </RestrictedArea>
  );
};
