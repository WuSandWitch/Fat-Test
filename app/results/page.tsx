"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTest } from "../context/TestProvider";
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
  const { calculateResults, restartTest, isTestComplete } = useTest();
  const resultRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  useEffect(() => {
    // 如果沒有測試完成，返回測試頁面
    if (!isTestComplete) {
      router.push("/test");
      return;
    }
    
    // 滾動到頂部
    window.scrollTo(0, 0);
  }, [isTestComplete, router]);
  
  // 獲取結果
  const results = calculateResults();
  
  if (!results) {
    return null;
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

  // 計算結果等級
  const getFatLevel = () => {
    const overallScore = Number(results["整體肥胖"]) || 0;
    if (overallScore > 80) return "超級胖狗";
    if (overallScore > 60) return "大胖狗";
    if (overallScore > 40) return "中胖狗";
    return "小胖狗";
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-6 gap-4 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
        {/* 可導出的結果區塊 */}
        <div ref={resultRef} className="w-full bg-amber-50 p-4 rounded-lg">
          {/* 主要視覺：胖狗圖片和標題 */}
          <div className="text-center animate-fade-down mb-5">
            <div className="flex justify-center mb-4">
              <div className="w-64 h-64 relative">
                <Image 
                  src="/images/doctor-dog.png" 
                  alt="博士狗圖片"
                  width={400}
                  height={400}
                  className="object-contain animate-bounce-slow"
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-amber-400">你是一隻{getFatLevel()}！</h1>
            <p className="text-2xl text-gray-800">肥胖指數：<span className="font-bold text-3xl">{results["整體肥胖"]}%</span></p>
          </div>
          
          {/* Fat Quote */}
          <div className="text-center p-3 bg-white rounded-lg mt-3 mb-4 animate-fade-in border-3 border-black" style={{ animationDelay: '1.5s' }}>
            <p className="italic text-gray-800 text-lg">
              &ldquo;不是你胖，只是你吃太多餅乾了。汪！&rdquo;
            </p>
            <p className="text-sm text-gray-700 mt-1">– 國家肥胖研究院</p>
          </div>
          
          {/* 詳細肥胖特質分析 - 直接顯示 */}
          <div className="w-full bg-white shadow-md rounded-lg p-3 mt-3 animate-fade-up border-3 border-black">
            <div className="pt-2">
              {Object.entries(results)
                .filter(([trait]) => trait !== "title" && trait !== "subtitle" && trait !== "description" && trait !== "advice" && trait !== "iconPath" && trait !== "level" && ["食物執念", "運動迴避", "零食創意", "自我欺騙", "整體肥胖"].includes(trait))
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
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={handleShare}
            disabled={isGeneratingImage}
            className={`rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center ${isGeneratingImage ? 'bg-amber-200' : 'bg-amber-300 hover:bg-amber-400'} text-black font-medium text-base h-14`}
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
            className={`rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center ${isGeneratingImage ? 'bg-gray-100' : 'bg-white hover:bg-amber-100'} text-black font-medium text-base h-14`}
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
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-base h-14"
          >
            再測一次！
          </button>
          
          <Link
            href="/"
            className="rounded-full border-4 border-black transition-colors flex-1 flex items-center justify-center bg-white hover:bg-amber-100 font-medium text-base h-14 text-gray-900"
          >
            回主頁
          </Link>
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