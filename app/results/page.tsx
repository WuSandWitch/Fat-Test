"use client";

import { useTest } from "../context/TestProvider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// Component to display trait bars
const TraitBar = ({ 
  trait, 
  score, 
  color,
  index
}: { 
  trait: string; 
  score: number; 
  color: string;
  index: number;
}) => {
  return (
    <div className="mb-3 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-900 dark:text-amber-100">{trait}</span>
        <span className="font-medium text-gray-800 dark:text-amber-200">{score}%</span>
      </div>
      <div className="w-full bg-white rounded-full h-3 dark:bg-gray-800 border-2 border-black">
        <div 
          className={`h-full rounded-full ${color} animate-grow-width`}
          style={{ 
            width: `${score}%`,
            animationDelay: `${(index * 150) + 300}ms`,
            animationDuration: '1.5s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const { isTestComplete, calculateResults, restartTest } = useTest();
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Redirect if test is not complete
  useEffect(() => {
    if (!isTestComplete) {
      router.push("/test");
    }
  }, [isTestComplete, router]);
  
  // Get results
  const results = calculateResults();
  
  // 分享結果
  const shareResults = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '狗狗肥胖檢測結果',
          text: `我的肥胖程度是${results["整體肥胖"]}%！看看你有多胖？`,
          url: window.location.href,
        });
      } else {
        // 複製到剪貼簿作為備選方案
        await navigator.clipboard.writeText(
          `我的肥胖程度是${results["整體肥胖"]}%！看看你有多胖？ ${window.location.href}`
        );
        alert('已複製結果連結到剪貼簿！');
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };

  // 匯出圖片
  const exportAsImage = async () => {
    if (!resultRef.current) return;
    
    try {
      // 動態引入 html-to-image 避免 SSR 問題
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(resultRef.current);
      
      // 創建一個臨時連結下載圖片
      const link = document.createElement('a');
      link.download = '我的肥胖檢測結果.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('匯出圖片失敗:', error);
      alert('匯出圖片失敗，請再試一次');
    }
  };
  
  // Define colors for each trait
  const traitColors: Record<string, string> = {
    "食物執念": "bg-amber-400",
    "運動迴避": "bg-blue-400",
    "自我欺騙": "bg-purple-400",
    "零食創意": "bg-green-400",
    "整體肥胖": "bg-amber-500"
  };

  // 計算結果等級
  const getFatLevel = () => {
    const overallScore = results["整體肥胖"] || 0;
    if (overallScore > 80) return "超級胖狗";
    if (overallScore > 60) return "大胖狗";
    if (overallScore > 40) return "中胖狗";
    return "小胖狗";
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-6 py-6 sm:py-10 gap-3 sm:gap-6 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-3 sm:gap-6 items-center max-w-md mx-auto w-full">
        {/* 可導出的結果區塊 */}
        <div ref={resultRef} className="w-full bg-amber-50 p-4 rounded-lg">
          <div className="text-center animate-fade-down">
            <div className="flex justify-center mb-2">
              <div className="w-40 h-40 sm:w-48 sm:h-48 animate-bounce-slow relative">
                <Image 
                  src="/images/fat-test.png" 
                  alt="胖狗圖片"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-gray-900 dark:text-amber-400">你是一隻{getFatLevel()}！</h1>
            <p className="text-lg text-gray-800">肥胖指數：<span className="font-bold text-2xl">{results["整體肥胖"]}%</span></p>
          </div>
          
          {/* 簡化的結果視覺化 */}
          <div className="w-full bg-white shadow-md rounded-lg p-4 mt-4 animate-fade-up border-4 border-black">
            <h2 className="text-xl font-bold mb-3 text-gray-900">肥胖特質</h2>
            
            {Object.entries(results)
              .filter(([trait]) => trait !== "整體肥胖" && ["食物執念", "運動迴避", "零食創意"].includes(trait))
              .map(([trait, score], index) => (
                <TraitBar 
                  key={trait} 
                  trait={trait} 
                  score={score} 
                  color={traitColors[trait] || "bg-gray-500"}
                  index={index}
                />
              ))
            }
            
            <div className="mt-4 pt-3 border-t-2 border-black">
              <div className="flex justify-between mb-1 items-center">
                <span className="font-bold text-lg text-gray-900">整體肥胖度</span>
                <span className="font-bold bg-white text-gray-900 px-3 py-1 rounded-full border-2 border-black">
                  {results["整體肥胖"]}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-4 dark:bg-gray-800 border-2 border-black">
                <div 
                  className="h-full rounded-full bg-amber-400 dark:bg-amber-500 animate-grow-width"
                  style={{ 
                    width: `${results["整體肥胖"]}%`,
                    animationDelay: `1200ms`,
                    animationDuration: '2s'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Fat Quote */}
          <div className="text-center p-3 bg-white rounded-lg mt-3 animate-fade-in border-3 border-black" style={{ animationDelay: '1.5s' }}>
            <p className="italic text-gray-800">
              &ldquo;不是你胖，只是你吃太多餅乾了。汪！&rdquo;
            </p>
            <p className="text-xs text-gray-700 mt-1">– 肥胖研究院</p>
          </div>
        </div>
        
        {/* 分享和匯出按鈕 */}
        <div className="flex gap-3 w-full mt-1 sm:mt-2">
          <button
            onClick={shareResults}
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-base h-14 sm:h-12"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            分享結果
          </button>
          
          <button
            onClick={exportAsImage}
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-white text-black hover:bg-amber-100 font-medium text-base h-14 sm:h-12"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            匯出圖片
          </button>
        </div>
        
        {/* 操作按鈕 */}
        <div className="flex gap-3 w-full">
          <button
            onClick={restartTest}
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-base h-14 sm:h-12"
          >
            再測一次！
          </button>
          
          <Link
            href="/"
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-white hover:bg-amber-100 font-medium text-base h-14 sm:h-12 text-gray-900"
          >
            回主頁
          </Link>
        </div>
      </main>
    </div>
  );
} 