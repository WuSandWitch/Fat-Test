"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

// 主頁面內容組件
function HomeContent() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 py-8 sm:py-16 gap-6 sm:gap-8 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900">
      <main className="flex flex-col items-center max-w-2xl mx-auto w-full">
        <div className="w-48 h-48 sm:w-64 sm:h-64 mb-4 sm:mb-6 relative">
          <div className="w-full h-full flex items-center justify-center">
            <Image 
              src="/images/doctor-dog.png" 
              alt="國家肥胖研究院博士狗"
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-center text-black dark:text-amber-100 mb-3 sm:mb-4">
          狗狗肥胖檢測
        </h1>
        
        <p className="text-base sm:text-lg text-center text-gray-900 dark:text-amber-200 mb-4 sm:mb-6">
          國家肥胖研究院最新研究成果，檢測您的心理肥胖程度！
        </p>
        
        <div className="bg-white dark:bg-gray-800 border-4 border-black p-5 rounded-lg w-full mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-amber-100">國家肥胖研究院公告</h2>
          <p className="text-sm sm:text-base text-gray-800 dark:text-amber-200 mb-3">
            根據本院近期研究顯示，透過心理測驗可有效評估個體的肥胖傾向及其潛在原因。此測驗結合最新心理學理論，能夠精準分析您的肥胖指數以及四大肥胖特質。
          </p>
          <p className="text-sm sm:text-base text-gray-800 dark:text-amber-200">
            本測驗共10題，完全免費，全程約需3分鐘。測試結果僅供參考，但可幫助您了解自己的飲食心理模式。請以輕鬆心情作答！
          </p>
        </div>
        
        <Link
          href="/test"
          className="bg-amber-300 hover:bg-amber-400 text-black px-8 py-3 rounded-lg font-bold text-lg border-4 border-black transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          開始科學測驗
        </Link>
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
