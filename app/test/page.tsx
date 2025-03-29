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
  
  // 預加載下一題和上一題的圖片
  useEffect(() => {
    // 預加載下一題圖片
    if (currentQuestionIndex < questions.length - 1) {
      const nextImgPath = questions[currentQuestionIndex + 1].imagePath;
      if (nextImgPath) {
        const nextQuestionImg = new window.Image();
        nextQuestionImg.src = nextImgPath;
      }
    }
    
    // 預加載上一題圖片
    if (currentQuestionIndex > 0) {
      const prevImgPath = questions[currentQuestionIndex - 1].imagePath;
      if (prevImgPath) {
        const prevQuestionImg = new window.Image();
        prevQuestionImg.src = prevImgPath;
      }
    }
  }, [currentQuestionIndex, questions]);
  
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
    <div className="flex flex-col h-screen bg-amber-50 dark:bg-gray-900 overflow-hidden">
      {/* 頂部導航欄 - 固定高度 */}
      <header className="w-full px-5 sm:px-8 py-3 sm:py-4 flex-none">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-1 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-amber-100">肥胖心理檢測</h1>
            <span className="text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-amber-100 px-3 py-1 rounded-full border-2 border-black">
              第 {currentQuestionIndex + 1} 題 / 共 {questions.length} 題
            </span>
          </div>
          
          {/* 進度條 */}
          <div className="w-full bg-white rounded-full h-2 sm:h-3 dark:bg-gray-800 overflow-hidden border-2 border-black">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out dark:bg-amber-500" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* 主要內容區域 - 自適應高度 */}
      <main className="flex-1 w-full px-5 sm:px-8 py-3 sm:py-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto h-full">
          <div 
            className={`w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 sm:p-4 border-4 border-black
              ${animating && direction === 'forward' ? 'animate-slide-out-left' : ''}
              ${animating && direction === 'backward' ? 'animate-slide-out-right' : ''}
              ${!animating ? 'animate-slide-in transform transition-all duration-500' : ''}
            `}
          >
            {/* 問題圖片和文字區域 - 自適應高度 */}
            <div className={`flex flex-col items-center justify-center mb-4 p-3 sm:p-4 rounded-lg ${currentQuestion.bgColor} border-4 border-black`}>
              <div className="relative w-full aspect-square max-h-[30vh] sm:max-h-[40vh]">
                {currentQuestion.imagePath && (
                  <Image 
                    src={currentQuestion.imagePath}
                    alt={`問題 ${currentQuestionIndex + 1} 圖片`}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-contain animate-fade-in"
                  />
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-3 text-center text-gray-900 dark:text-amber-100">{currentQuestion.text}</h2>
            </div>
            
            {/* 選項區域 - 自適應高度 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`flex items-center p-2 sm:p-3 border-3 border-black rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}`
                      ? 'bg-amber-200 dark:bg-amber-800 scale-[1.02]'
                      : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className={`min-w-4 h-4 sm:min-w-5 sm:h-5 rounded-full border-2 border-black flex items-center justify-center mr-2 sm:mr-3 transition-all duration-300 ${
                    currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}`
                      ? 'bg-amber-500 dark:bg-amber-400 scale-110'
                      : 'bg-white dark:bg-gray-600'
                  }`}>
                    {currentQuestionAnswer && currentQuestionAnswer[1] === `${index + 1}` && (
                      <div className="w-2 h-2 rounded-full bg-white animate-scale-in"></div>
                    )}
                  </div>
                  <span className="text-sm sm:text-base text-gray-900 dark:text-amber-100">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部導航按鈕 - 移到內容區域內 */}
          <div className="flex justify-between gap-3 mt-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || animating}
              className={`px-3 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-300 border-3 border-black ${
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
              className={`px-3 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-300 border-3 border-black ${
                !currentQuestionAnswer || animating
                  ? 'bg-amber-200 text-gray-400 cursor-not-allowed dark:bg-amber-900 dark:text-gray-500'
                  : 'bg-amber-300 text-black hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? '看結果' : '下一題'}
            </button>
          </div>
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