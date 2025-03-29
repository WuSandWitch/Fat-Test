"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTest } from "../context/TestProvider";
import Image from "next/image";
import { ResultType } from "../context/TestProvider";

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
    <div className="mb-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-900 dark:text-amber-100">{trait}</span>
        <span className="font-medium text-gray-800 dark:text-amber-200">{score}%</span>
      </div>
      <div className="w-full bg-white rounded-full h-2.5 dark:bg-gray-800 border-2 border-black">
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

// 結果頁面內容組件
function ResultsContent() {
  const router = useRouter();
  const { calculateResults, isTestComplete } = useTest();
  const resultRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [results, setResults] = useState<ResultType | null>(null);
  
  useEffect(() => {
    // 如果沒有測試完成，返回測試頁面
    if (!isTestComplete) {
      router.push("/test");
      return;
    }
    
    // 在客戶端計算結果
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    
    // 滾動到頂部
    window.scrollTo(0, 0);
  }, [isTestComplete, router, calculateResults]);
  
  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50 dark:bg-gray-900">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 生成和分享結果圖片
  const generateImage = async (): Promise<string | null> => {
    if (!resultRef.current) return null;
    
    try {
      setIsGeneratingImage(true);
      // 動態引入 html-to-image 避免 SSR 問題
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(resultRef.current);
      setIsGeneratingImage(false);
      return dataUrl;
    } catch (error) {
      console.error('生成圖片失敗:', error);
      setIsGeneratingImage(false);
      return null;
    }
  };
  
  // 處理分享結果
  const handleShare = async () => {
    try {
      // 生成圖片
      const dataUrl = await generateImage();
      if (!dataUrl) {
        alert("生成圖片失敗，請再試一次");
        return;
      }
      
      if (navigator.share) {
        // 從dataUrl創建文件
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], '狗狗肥胖檢測結果.png', { type: 'image/png' });
        
        try {
          await navigator.share({
            title: "狗狗肥胖檢測結果",
            text: `我的測試結果：${results.title} - 肥胖指數：${results["整體肥胖"]}%！`,
            files: [file]
          });
        } catch (shareError) {
          console.log("分享檔案失敗或用戶取消分享", shareError);
          // 用戶取消分享時不要嘗試再次分享，直接返回
          return;
        }
      } else {
        // 備用：如果不支持分享API，複製到剪貼板並提示下載
        exportAsImage(dataUrl);
        alert("圖片已下載，可以分享給朋友了！");
      }
    } catch (error) {
      console.error("分享失敗", error);
      alert("分享失敗，請再試一次");
    }
  };
  
  // 匯出圖片
  const exportAsImage = async (dataUrl?: string | null) => {
    try {
      if (!dataUrl) {
        dataUrl = await generateImage();
      }
      
      if (!dataUrl) {
        alert("匯出圖片失敗，請再試一次");
        return;
      }
      
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

  return (
    <div className="flex flex-col h-screen bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex-1 w-full px-5 sm:px-8 py-3 sm:py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-full py-6">
          {/* 可導出的結果區塊 */}
          <div ref={resultRef} className="w-full max-w-xl mx-auto">
            {/* 主要視覺：胖狗圖片和標題 */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-64 h-64 sm:w-80 sm:h-80 relative mb-4 sm:mb-6">
                <Image 
                  src={results.iconPath} 
                  alt="胖狗圖片"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 640px) 256px, 320px"
                  className="object-contain animate-bounce-slow"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 dark:text-amber-400 mb-2">
                {results.title}
              </h1>
              <p className="text-2xl sm:text-3xl text-center text-gray-800 dark:text-amber-200 mb-6">
                肥胖指數：<span className="font-bold">{results["整體肥胖"]}%</span>
              </p>
            </div>
            
            {/* Fat Quote */}
            <div className="text-center p-4 bg-white rounded-lg mb-6 animate-fade-in border-4 border-black dark:bg-gray-800">
              <p className="italic text-lg sm:text-xl text-gray-800 dark:text-amber-200">
                &ldquo;{results.advice}&rdquo;
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-amber-300 mt-2">
                – 國家肥胖研究院
              </p>
            </div>
            
            {/* 詳細肥胖特質分析 */}
            <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-5 border-4 border-black">
              <div className="space-y-3">
                {Object.entries(results)
                  .filter(([trait]) => trait !== "title" && trait !== "subtitle" && trait !== "description" && trait !== "advice" && trait !== "iconPath" && ["食物執念", "運動迴避", "零食創意", "自我欺騙"].includes(trait))
                  .map(([trait, score], index) => (
                    <TraitBar 
                      key={trait} 
                      trait={trait} 
                      score={Number(score)} 
                      color={traitColors[trait] || "bg-gray-500"}
                      index={index}
                    />
                  ))
                }
              </div>
            </div>
          </div>
          
          {/* 分享和匯出按鈕 */}
          <div className="w-full max-w-xl mx-auto space-y-3 mt-6">
            <button
              onClick={handleShare}
              disabled={isGeneratingImage}
              className={`w-full rounded-lg border-4 border-black transition-colors flex items-center justify-center ${
                isGeneratingImage ? 'bg-amber-200' : 'bg-amber-300 hover:bg-amber-400'
              } text-black font-bold text-lg h-12`}
            >
              {isGeneratingImage ? (
                <>
                  <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  準備中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                  分享結果
                </>
              )}
            </button>
            
            <button
              onClick={() => exportAsImage()}
              disabled={isGeneratingImage}
              className={`w-full rounded-lg border-4 border-black transition-colors flex items-center justify-center ${
                isGeneratingImage ? 'bg-gray-100' : 'bg-white hover:bg-amber-100'
              } text-black font-bold text-lg h-12`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              匯出圖片
            </button>
            
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  alert('連結已複製到剪貼簿！');
                }).catch(() => {
                  alert('複製失敗，請手動複製連結');
                });
              }}
              className="w-full rounded-lg border-4 border-black transition-colors bg-white hover:bg-amber-100 text-black font-bold text-lg h-12 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              複製連結
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// 頁面組件
export default function ResultsPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50 dark:bg-gray-900">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <ResultsContent />;
} 