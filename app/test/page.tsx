"use client";

import { useTest } from "../context/TestProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestPage() {
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
  
  // Check if current question has been answered
  const currentQuestionAnswer = answers.find(
    answer => answer.questionId === currentQuestion.id
  );
  
  // Handle option selection
  const handleOptionSelect = (value: number) => {
    setAnswer(currentQuestion.id, value);
  };
  
  // Handle next question with animation
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
  
  // Handle previous question with animation
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
  
  // Navigate to results when test is complete
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
          
          {/* Progress bar */}
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
          <div className={`flex flex-col items-center justify-center mb-5 p-4 sm:p-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 border-4 border-black`}>
            <div className={`relative w-36 h-36 sm:w-40 sm:h-40 ${currentQuestion.animation}`}>
              {/* 每個問題的粗線條小狗插圖 */}
              {currentQuestion.id === 1 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="50" r="25" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M30,45 Q25,30 35,40" fill="none" /> {/* 左耳 */}
                    <path d="M70,45 Q75,30 65,40" fill="none" /> {/* 右耳 */}
                    <circle cx="43" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="57" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="50" cy="55" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M40,60 Q50,65 60,60" fill="none" /> {/* 嘴巴 */}
                    <path d="M30,20 Q50,10 70,20" fill="none" strokeDasharray="2 2" /> {/* 食物氣味 */}
                    <circle cx="50" cy="15" r="6" fill="#FFCC80" stroke="#000" /> {/* 食物 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 2 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="20" y="60" width="60" height="25" rx="5" fill="#D7CCC8" /> {/* 沙發 */}
                    <circle cx="50" cy="45" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M35,35 Q25,25 35,30" fill="none" /> {/* 左耳 */}
                    <path d="M65,35 Q75,25 65,30" fill="none" /> {/* 右耳 */}
                    <circle cx="43" cy="40" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="57" cy="40" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="50" cy="45" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M40,55 Q50,60 60,55" fill="none" /> {/* 嘴巴 */}
                    <line x1="70" y1="50" x2="85" y2="45" strokeWidth="3" /> {/* 遙控器線 */}
                    <rect x="85" y="40" width="8" height="10" rx="2" fill="#607D8B" /> {/* 遙控器 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 3 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="55" r="25" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M30,45 Q25,30 35,40" fill="none" /> {/* 左耳 */}
                    <path d="M70,45 Q75,30 65,40" fill="none" /> {/* 右耳 */}
                    <circle cx="43" cy="50" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="57" cy="50" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="50" cy="60" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M40,68 Q50,75 60,68" fill="none" /> {/* 大笑嘴巴 */}
                    <rect x="20" y="15" width="60" height="20" rx="5" fill="#FFFFFF" /> {/* 對話框 */}
                    <text x="50" y="30" textAnchor="middle" fontSize="10" fill="#000">你變胖了!</text>
                  </g>
                </svg>
              )}
              {currentQuestion.id === 4 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="40" cy="50" r="25" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M20,40 Q15,25 25,35" fill="none" /> {/* 左耳 */}
                    <path d="M60,40 Q65,25 55,35" fill="none" /> {/* 右耳 */}
                    <circle cx="33" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="47" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="40" cy="55" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M30,60 Q40,65 50,60" fill="none" /> {/* 嘴巴 */}
                    <path d="M75,30 L75,60" strokeWidth="5" /> {/* 薯條中間 */}
                    <path d="M67,30 L67,60" strokeWidth="5" /> {/* 薯條左邊 */}
                    <path d="M83,30 L83,60" strokeWidth="5" fill="#FFD54F" /> {/* 薯條右邊 */}
                    <rect x="65" y="60" width="20" height="10" rx="2" fill="#EF5350" /> {/* 薯條盒 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 5 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="60" y="20" width="30" height="60" rx="2" fill="#B0BEC5" /> {/* 電梯 */}
                    <line x1="60" y1="50" x2="90" y2="50" /> {/* 電梯中線 */}
                    <circle cx="75" cy="40" r="3" fill="#F44336" /> {/* 電梯按鈕 */}
                    <text x="75" y="70" textAnchor="middle" fontSize="7" fill="#000" strokeWidth="0.5">故障中</text>
                    <circle cx="30" cy="50" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M15,40 Q10,25 20,35" fill="none" /> {/* 左耳 */}
                    <path d="M45,40 Q50,25 40,35" fill="none" /> {/* 右耳 */}
                    <circle cx="25" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="35" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="30" cy="50" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M25,60 Q30,57 35,60" fill="none" /> {/* 失落嘴巴 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 6 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="60" y="50" width="30" height="5" rx="2" fill="#90A4AE" /> {/* 體重計 */}
                    <rect x="65" y="40" width="20" height="10" rx="1" fill="#ECEFF1" /> {/* 顯示屏 */}
                    <circle cx="30" cy="50" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M15,40 Q10,25 20,35" fill="none" /> {/* 左耳 */}
                    <path d="M45,40 Q50,25 40,35" fill="none" /> {/* 右耳 */}
                    <circle cx="25" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="35" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="30" cy="50" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M25,60 Q30,65 35,60" fill="none" /> {/* 微笑嘴巴 */}
                    <circle cx="80" cy="25" r="8" fill="#FFFFFF" /> {/* 思考泡泡 */}
                    <text x="80" y="28" textAnchor="middle" fontSize="10" fill="#000" strokeWidth="1">?</text>
                  </g>
                </svg>
              )}
              {currentQuestion.id === 7 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="40" cy="45" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M25,35 Q15,20 25,30" fill="none" /> {/* 左耳 */}
                    <path d="M55,35 Q65,20 55,30" fill="none" /> {/* 右耳 */}
                    <circle cx="35" cy="40" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="45" cy="40" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="40" cy="45" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M35,55 Q40,60 45,55" fill="none" /> {/* 嘴巴 */}
                    <rect x="70" y="40" width="20" height="20" rx="3" fill="#FFCC80" /> {/* 外送包裹 */}
                    <line x1="80" y1="40" x2="80" y2="30" /> {/* 包裹提手 */}
                    <rect x="20" y="75" width="60" height="10" rx="2" fill="#8D6E63" /> {/* 桌子 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 8 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z" fill="#E1F5FE" strokeDasharray="3 3" /> {/* 夢境泡泡 */}
                    <circle cx="50" cy="50" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M35,40 Q30,25 40,35" fill="none" /> {/* 左耳 */}
                    <path d="M65,40 Q70,25 60,35" fill="none" /> {/* 右耳 */}
                    <path d="M45,55 Q50,60 55,55" fill="none" /> {/* 嘴巴 */}
                    <line x1="43" y1="45" x2="46" y2="42" /> {/* 左眼-閉眼線 */}
                    <line x1="57" y1="45" x2="54" y2="42" /> {/* 右眼-閉眼線 */}
                    <circle cx="50" cy="50" r="4" fill="#000" /> {/* 鼻子 */}
                    <circle cx="50" cy="25" r="6" fill="#FFCC80" /> {/* 食物 */}
                    <circle cx="65" cy="30" r="4" fill="#FFCC80" /> {/* 小食物 */}
                    <circle cx="35" cy="30" r="5" fill="#FFCC80" /> {/* 小食物 */}
                  </g>
                </svg>
              )}
              {currentQuestion.id === 9 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="50" r="25" fill="#FFF8E1" /> {/* 動物頭 */}
                    <path d="M30,40 Q25,20 35,35" fill="none" /> {/* 左耳 */}
                    <path d="M70,40 Q75,20 65,35" fill="none" /> {/* 右耳 */}
                    <circle cx="43" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="57" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="50" cy="52" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M40,60 Q50,65 60,60" fill="none" /> {/* 嘴巴 */}
                    <path d="M15,60 Q10,75 20,70" strokeWidth="5" fill="none" /> {/* 尾巴 */}
                    <circle cx="75" cy="25" r="8" fill="#FFFFFF" strokeDasharray="3 2" /> {/* 思考泡泡 */}
                    <text x="75" y="28" textAnchor="middle" fontSize="10" fill="#000" strokeWidth="1">?</text>
                  </g>
                </svg>
              )}
              {currentQuestion.id === 10 && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="40" cy="50" r="20" fill="#FFF8E1" /> {/* 狗頭 */}
                    <path d="M25,40 Q20,25 30,35" fill="none" /> {/* 左耳 */}
                    <path d="M55,40 Q60,25 50,35" fill="none" /> {/* 右耳 */}
                    <circle cx="35" cy="45" r="3" fill="#000" /> {/* 左眼 */}
                    <circle cx="45" cy="45" r="3" fill="#000" /> {/* 右眼 */}
                    <circle cx="40" cy="50" r="4" fill="#000" /> {/* 鼻子 */}
                    <path d="M35,55 Q40,60 45,55" fill="none" /> {/* 嘴巴 */}
                    <rect x="70" y="35" width="20" height="15" rx="2" fill="#607D8B" /> {/* 電視 */}
                    <rect x="73" y="38" width="14" height="9" rx="1" fill="#B3E5FC" /> {/* 電視屏幕 */}
                    <line x1="75" y1="50" x2="75" y2="55" /> {/* 電視腳 */}
                    <line x1="85" y1="50" x2="85" y2="55" /> {/* 電視腳 */}
                  </g>
                </svg>
              )}
            </div>
            <h2 className="text-xl sm:text-xl mt-3 sm:mt-4 font-bold text-center text-gray-900 dark:text-amber-100">{currentQuestion.text}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`flex items-center p-4 border-3 border-black rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  currentQuestionAnswer?.value === index + 1
                    ? 'bg-amber-200 dark:bg-amber-800 scale-[1.02]'
                    : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleOptionSelect(index + 1)}
              >
                <div className={`min-w-5 h-5 rounded-full border-2 border-black flex items-center justify-center mr-3 transition-all duration-300 ${
                  currentQuestionAnswer?.value === index + 1
                    ? 'bg-amber-500 dark:bg-amber-400 scale-110'
                    : 'bg-white dark:bg-gray-600'
                }`}>
                  {currentQuestionAnswer?.value === index + 1 && (
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