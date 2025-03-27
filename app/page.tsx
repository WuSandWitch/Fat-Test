import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 py-10 sm:py-20 gap-4 sm:gap-8 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-5 sm:gap-8 items-center max-w-3xl mx-auto text-center">
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 mb-0 sm:mb-2 animate-float">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* 黑色粗線小狗 */}
            <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              {/* 狗狗身體 */}
              <path d="M60,130 Q80,140 120,130 Q140,120 150,100 Q155,80 140,70 Q120,60 100,70 Q80,60 60,70 Q45,80 50,100 Q60,120 60,130" fill="#FFF8E1" />
              
              {/* 狗狗頭 */}
              <circle cx="100" cy="90" r="35" fill="#FFF8E1" />
              
              {/* 狗狗耳朵 */}
              <path d="M75,65 Q65,50 80,60" fill="none" />
              <path d="M125,65 Q135,50 120,60" fill="none" />
              
              {/* 狗狗眼睛 */}
              <circle cx="85" cy="85" r="4" fill="#000" />
              <circle cx="115" cy="85" r="4" fill="#000" />
              
              {/* 狗狗鼻子和嘴 */}
              <circle cx="100" cy="95" r="5" fill="#000" />
              <path d="M85,105 Q100,115 115,105" fill="none" />
              
              {/* 思考氣泡 */}
              <circle cx="150" cy="50" r="10" fill="#FFF" />
              <circle cx="165" cy="40" r="6" fill="#FFF" />
              <circle cx="175" cy="30" r="4" fill="#FFF" />
              
              {/* 食物在思考氣泡中 */}
              <path d="M145,50 Q150,45 155,50 Q150,55 145,50" fill="#FFCC80" />
            </g>
            
            {/* 文字 */}
            <text x="100" y="175" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">
              心胖檢測
            </text>
          </svg>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl leading-tight text-gray-900 dark:text-amber-100">
          狗狗心胖檢測
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-800 dark:text-amber-100 max-w-xl">
          你的心靈是否像隻吃太多零食的狗狗一樣胖呢？透過我們這個毫無科學根據的測驗來發現你內心的小胖狗！
          警告：結果可能會讓你噴飯又略帶冒犯。
        </p>
        
        <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 shadow-md w-full border-4 border-black">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-amber-100">如何運作</h2>
          <ol className="list-decimal text-left space-y-3 mx-auto inline-block pl-5">
            <li className="tracking-[-.01em] text-lg sm:text-base">
              回答一系列莫名其妙的問題
            </li>
            <li className="tracking-[-.01em] text-lg sm:text-base">
              我們的算法使用AI（人工智障）分析你的回答
            </li>
            <li className="tracking-[-.01em] text-lg sm:text-base">
              獲得詳細的心胖特質分析報告
            </li>
            <li className="tracking-[-.01em] text-lg sm:text-base">
              發現我們早就知道的事實：你的心靈跟隻吃太飽的柴犬一樣胖
            </li>
          </ol>
        </div>

        <div className="mt-2 sm:mt-4 w-full max-w-xs">
          <Link
            className="rounded-full border-4 border-black transition-colors flex items-center justify-center bg-amber-300 text-black hover:bg-amber-400 font-medium text-lg sm:text-base h-14 sm:h-12 px-8 w-full"
            href="/test"
          >
            開始檢測吧！汪！
          </Link>
        </div>
        
        <div className="mt-3 sm:mt-8 text-sm sm:text-sm text-gray-800 dark:text-amber-200 max-w-xl">
          <p>
            <strong>免責聲明：</strong>此測驗純屬胡說八道，請勿認真對待。
            如果你感到被冒犯，那只是你心中的小胖狗在抗議而已。
          </p>
        </div>
      </main>
    </div>
  );
}
