"use client";

import { useTest } from "../context/TestProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export default function ResultsPage() {
  const router = useRouter();
  const { isTestComplete, calculateResults, restartTest } = useTest();
  const [animationComplete, setAnimationComplete] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);
  
  // Redirect if test is not complete
  useEffect(() => {
    if (!isTestComplete) {
      router.push("/test");
    } else {
      // Trigger animation completion after a delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isTestComplete, router]);
  
  // Get results
  const results = calculateResults();
  
  // 保留整體心胖度作為主要結果
  const overallFattness = results["整體心胖"] || 75;
  
  // 標籤文字基於心胖度
  const getFatLabel = () => {
    if (overallFattness > 85) return "超級胖";
    if (overallFattness > 70) return "非常胖";
    if (overallFattness > 50) return "有點胖";
    return "微胖";
  };
  
  // 分享結果
  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '狗狗心胖檢測結果',
          text: `我的心靈${getFatLabel()}度達到了${overallFattness}%！快來測測你的心有多胖吧！`,
          url: window.location.href,
        });
      } else {
        // 如果瀏覽器不支援 Web Share API，複製連結到剪貼簿
        await navigator.clipboard.writeText(
          `我的心靈${getFatLabel()}度達到了${overallFattness}%！快來測測你的心有多胖吧！${window.location.origin}`
        );
        alert('結果連結已複製到剪貼簿！');
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };
  
  // 匯出結果為圖片
  const exportResult = async () => {
    if (!resultCardRef.current) return;
    
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, `狗狗心胖檢測-${overallFattness}%.png`);
        }
      });
    } catch (error) {
      console.error('匯出失敗:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-8 py-8 sm:py-16 gap-6 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-6 items-center max-w-md mx-auto w-full">
        <div ref={resultCardRef} className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border-4 border-black flex flex-col items-center animate-fade-in">
          <div className="w-32 h-32 sm:w-40 sm:h-40 animate-bounce-slow mb-4">
            <svg 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g>
                {/* 狗頭 */}
                <circle cx="50" cy="50" r="30" fill="#FFF8E1" />
                {/* 左耳 */}
                <path d="M25,40 Q15,20 30,30" fill="none" />
                {/* 右耳 */}
                <path d="M75,40 Q85,20 70,30" fill="none" />
                {/* 左眼 */}
                <circle cx="40" cy="45" r="3" fill="#000" />
                {/* 右眼 */}
                <circle cx="60" cy="45" r="3" fill="#000" />
                {/* 鼻子 */}
                <circle cx="50" cy="55" r="5" fill="#000" />
                {/* 大笑嘴巴 */}
                <path d="M35,65 Q50,80 65,65" strokeWidth="3" fill="none" />
                {/* 皇冠 */}
                <path d="M30,25 L45,15 L55,15 L70,25" fill="none" />
                <path d="M35,25 L45,15" fill="none" />
                <path d="M55,15 L65,25" fill="none" />
                <circle cx="45" cy="15" r="2" fill="#FFCC80" />
                <circle cx="55" cy="15" r="2" fill="#FFCC80" />
              </g>
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-center text-gray-900 dark:text-amber-400">
            你{getFatLabel()}的！
          </h1>
          
          <div className="w-full my-6">
            <div className="flex justify-between mb-2 items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-amber-400">心胖度</span>
              <span className="text-xl font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-100 px-3 py-1 rounded-full border-2 border-black">
                {overallFattness}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-6 dark:bg-gray-800 border-2 border-black">
              <div 
                className="h-full rounded-full bg-amber-400 dark:bg-amber-500 animate-grow-width"
                style={{ 
                  width: `${overallFattness}%`,
                  animationDelay: `500ms`,
                  animationDuration: '2s'
                }}
              ></div>
            </div>
          </div>
          
          <p className="text-center text-lg text-gray-800 dark:text-amber-200 mb-2">
            你的心靈像隻吃太飽的柴犬一樣胖！
          </p>
          
          <p className="italic text-sm text-center text-gray-700 dark:text-amber-300 mt-2 mb-4">
            "不是你胖，只是你的心靈為了裝下那些想法，長了額外的軟墊罷了。"
          </p>
          
          <div className="text-xs text-center text-gray-500 dark:text-amber-200/70 mt-2">
            心胖檢測 | 純屬娛樂
          </div>
        </div>
        
        {/* Action buttons */}
        <div className={`grid grid-cols-2 gap-4 w-full mt-2 transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={shareResult}
            className="rounded-full border-4 border-black transition-colors flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-lg h-14 px-4 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享結果
          </button>
          
          <button
            onClick={exportResult}
            className="rounded-full border-4 border-black transition-colors flex items-center justify-center bg-white hover:bg-amber-100 font-medium text-lg h-14 px-4 w-full text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            儲存圖片
          </button>
        </div>
        
        {/* Navigation buttons */}
        <div className={`flex gap-4 items-center flex-col mt-2 w-full transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={restartTest}
            className="rounded-full border-4 border-black transition-colors flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-lg h-14 px-8 w-full"
          >
            再測一次！汪汪！
          </button>
          
          <Link
            href="/"
            className="rounded-full border-4 border-black transition-colors flex items-center justify-center bg-white hover:bg-amber-100 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium text-lg h-14 px-8 w-full text-gray-900 dark:text-amber-200"
          >
            回主頁
          </Link>
        </div>
      </main>
    </div>
  );
} 