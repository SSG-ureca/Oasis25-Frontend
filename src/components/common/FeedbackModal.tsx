import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, X } from "lucide-react";
import { Panel } from "./Panel";
import { Button } from "./Button";
import { createFeedback } from "../../services/feedbackApi";
import { toast } from "react-hot-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [isGood, setIsGood] = useState<boolean | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // 피드백 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGood === null) {
      toast.error("만족도를 선택해주세요!");
      return;
    }

    setIsLoading(true);
    try {
      await createFeedback({ isGood, content });
      toast.success("피드백을 보내주셔서 감사합니다! ❤️");
      setIsGood(null);
      setContent("");
      onClose();
    } catch (error: any) {
      console.error("Feedback submit failed:", error);
      if (error.response?.status === 403) {
        toast.error("로그인이 필요한 기능입니다. 로그인 후 다시 이용해 주세요.");
      } else {
        toast.error("피드백 전송에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15 backdrop-blur-[2px] animate-in fade-in duration-200">
      {/* 바깥 배경 클릭 시 닫힘 */}
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[400px] p-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[24px] p-5 flex flex-col space-y-3.5">
          {/* 헤더 및 설명 글귀 */}
          <div className="flex justify-between items-start w-full">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">
                피드백 보내기
              </h3>
              <p className="text-[10px] text-gray-400 leading-normal">
                더 나은 오아시스25를 위해 소중한 한마디를 들려주세요.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100/80 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex gap-2.5 py-0.5">
              <button
                type="button"
                onClick={() => setIsGood(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isGood === true
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.08)]"
                    : "bg-gray-50/50 border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Good</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGood(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isGood === false
                    ? "bg-rose-50/60 border-rose-200 text-rose-500 shadow-[0_4px_12px_rgba(244,3,94,0.08)]"
                    : "bg-gray-50/50 border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Bad</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-bold tracking-wider block uppercase pl-0.5">
                FEEDBACK DETAILS
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오아시스에 대한 개선사항이나 의견을 적어주세요."
                rows={5}
                className="w-full p-3 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary/30 focus:bg-white text-gray-700 font-sans resize-none transition-all placeholder-gray-400/80 leading-relaxed"
              />
            </div>

            {/* 하단 버튼 제어 */}
            <div className="flex justify-end items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#ff1b5f] disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(255,55,118,0.2)] hover:shadow-[0_6px_16px_rgba(255,55,118,0.3)]"
              >
                {isLoading ? "전송 중..." : "보내기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
