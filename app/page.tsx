"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTest } from "./context/TestProvider";

// 主頁面內容組件
function HomeContent() {
  const router = useRouter();
  const { restartTest } = useTest();

  const handleStartTest = () => {
    // 清除上次測驗紀錄
    localStorage.removeItem('testState');
    restartTest();
    router.push('/test');
  };

  return (
    <div className="flex flex-col h-screen bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex-1 w-full px-5 sm:px-8 py-3 sm:py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-full py-6">
          {/* 視覺主體：圖片和標題 */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="w-64 h-64 sm:w-80 sm:h-80 relative mb-4 sm:mb-6">
              <Image 
                src="/images/doctor-dog.png" 
                alt="國家肥胖研究院博士狗"
                fill
                priority
                className="object-contain animate-bounce-slow"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-center text-black dark:text-amber-100 mb-2">
              肥胖心理測驗
            </h1>
            
            <p className="text-base sm:text-lg text-center text-gray-900 dark:text-amber-200 mb-8 sm:mb-10">
              國家肥胖研究院最新研究成果，透過心理測驗評估您的肥胖程度！
            </p>
          </div>
          
          {/* 資訊卡片 */}
          <div className="w-full max-w-xl mx-auto space-y-4">
            <div className="bg-white dark:bg-gray-800 border-4 border-black p-4 sm:p-5 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 dark:text-amber-100">國家肥胖研究院公告</h2>
              <div className="space-y-2 text-sm sm:text-base text-gray-800 dark:text-amber-200">
                <p>
                  根據本院近期研究顯示，透過心理測驗可有效評估個體的肥胖傾向及其潛在原因。此測驗結合最新心理學理論，能夠精準分析您的肥胖指數以及四大肥胖特質。
                </p>
                <p>
                  本測驗共10題，完全免費，全程約需3分鐘。測試結果僅供參考，但可幫助您了解自己的飲食心理模式。請以輕鬆心情作答！
                </p>
              </div>
            </div>
            
            <button
              onClick={handleStartTest}
              className="block w-full bg-amber-300 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-bold text-lg text-center border-4 border-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
            >
              開始科學測驗
            </button>
            
            {/* 作者連結 */}
            <div className="text-center mt-6 text-gray-600 dark:text-amber-300/70 text-sm">
              <p>@<a href="https://wusandwitch.zudo.cc" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-600 dark:hover:text-amber-300 transition-colors">Owen Wu</a> | @<a href="https://github.com/joan0802" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-600 dark:hover:text-amber-300 transition-colors">JN Tsai</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 頁面組件
export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <HomeContent />;
}
