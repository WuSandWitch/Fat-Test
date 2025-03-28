"use client";

import { useTest } from "../context/TestProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// 客戶端專用測試組件
function TestContent() {
  const router = useRouter();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    setAnswer, 
    nextQuestion, 
    previousQuestion,
    isTestComplete
  } = useTest();
  
  const currentQuestion = questions[currentQuestionIndex];
  const [direction, setDirection] = useState<'forward' | 'backward' | null>(null);
  const [animating, setAnimating] = useState(false);
  
  // 檢查當前問題是否已回答
  const currentQuestionAnswer = Object.entries(answers).find(
    ([key]) => key === currentQuestion.id.toString()
  );
  
  // 處理選項選擇
  const handleOptionSelect = (index: number) => {
    setAnswer(currentQuestion.id.toString(), `${index + 1}`);
  };
  
  // 處理下一問題和動畫
  const handleNextQuestion = () => {
    if (!animating && currentQuestionAnswer) {
      setAnimating(true);
      setDirection('forward');
      setTimeout(() => {
        nextQuestion();
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 400);
    }
  };
  
  // 處理上一問題和動畫
  const handlePreviousQuestion = () => {
    if (!animating && currentQuestionIndex > 0) {
      setAnimating(true);
      setDirection('backward');
      setTimeout(() => {
        previousQuestion();
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 400);
    }
  };
  
  // 測試完成時導航到結果頁
  useEffect(() => {
    if (isTestComplete && currentQuestionIndex === questions.length - 1) {
      router.push("/results");
    }
  }, [isTestComplete, currentQuestionIndex, questions.length, router]);
  
  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-8 py-8 sm:py-16 gap-4 sm:gap-8 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-4 sm:gap-8 items-center max-w-3xl mx-auto w-full">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-3 sm:mb-4 gap-2">
            <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 dark:text-amber-100">狗狗肥胖檢測</h1>
            <span className="text-base sm:text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-amber-100 px-3 py-1 rounded-full border-2 border-black">
              第 {currentQuestionIndex + 1} 題 / 共 {questions.length} 題
            </span>
          </div>
          
          {/* 進度條 */}
          <div className="w-full bg-white rounded-full h-3 mb-4 sm:mb-8 dark:bg-gray-800 overflow-hidden border-2 border-black">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out dark:bg-amber-500" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div 
          className={`w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 border-4 border-black
            ${animating && direction === 'forward' ? 'animate-slide-out-left' : ''}
            ${animating && direction === 'backward' ? 'animate-slide-out-right' : ''}
            ${!animating ? 'animate-slide-in transform transition-all duration-500' : ''}
          `}
        >
          <div className={`flex flex-col items-center justify-center mb-5 p-4 sm:p-6 rounded-lg ${currentQuestion.bgColor} border-4 border-black`}>
            <div className="relative w-full h-48 sm:h-64 md:h-72">
              {/* 使用 Next.js Image 組件顯示問題圖片 */}
              {currentQuestion.imagePath && (
                <Image 
                  src={currentQuestion.imagePath}
                  alt={`問題 ${currentQuestionIndex + 1} 圖片`}
                  fill
                  priority
                  className="object-contain animate-fade-in"
                />
              )}
            </div>
            <h2 className="text-xl sm:text-xl mt-4 sm:mt-6 font-bold text-center text-gray-900 dark:text-amber-100">{currentQuestion.text}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`flex items-center p-4 border-3 border-black rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}`
                    ? 'bg-amber-200 dark:bg-amber-800 scale-[1.02]'
                    : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className={`min-w-5 h-5 rounded-full border-2 border-black flex items-center justify-center mr-3 transition-all duration-300 ${
                  currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}`
                    ? 'bg-amber-500 dark:bg-amber-400 scale-110'
                    : 'bg-white dark:bg-gray-600'
                }`}>
                  {currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}` && (
                    <div className="w-2 h-2 rounded-full bg-white animate-scale-in"></div>
                  )}
                </div>
                <span className="text-base sm:text-base text-gray-900 dark:text-amber-100">{option}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between w-full mt-2 sm:mt-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || animating}
            className={`px-4 sm:px-6 py-2 rounded-md font-medium text-base sm:text-base transition-all duration-300 border-3 border-black ${
              currentQuestionIndex === 0 || animating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-white text-gray-900 hover:bg-amber-100 dark:bg-gray-800 dark:text-amber-100 dark:hover:bg-gray-700'
            }`}
          >
            上一題
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={!currentQuestionAnswer || animating}
            className={`px-4 sm:px-6 py-2 rounded-md font-medium text-base sm:text-base transition-all duration-300 border-3 border-black ${
              !currentQuestionAnswer || animating
                ? 'bg-amber-200 text-gray-400 cursor-not-allowed dark:bg-amber-900 dark:text-gray-500'
                : 'bg-amber-300 text-black hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? '看結果' : '下一題'}
          </button>
        </div>
      </main>
    </div>
  );
}

// 主頁面組件，安全處理 hydration
export default function TestPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 簡單的初始載入界面，確保 SSR 和 CSR 一致
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <TestContent />;
} 