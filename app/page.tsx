import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 py-10 sm:py-20 gap-4 sm:gap-8 font-[family-name:var(--font-geist-sans)] bg-amber-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex flex-col gap-4 sm:gap-6 items-center max-w-3xl mx-auto w-full">
        <div className="flex justify-center w-full">
          <div className="w-48 h-48 sm:w-64 sm:h-64">
            {/* SVG Logo */}
            <svg 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 胖狗形狀 */}
              <ellipse cx="100" cy="120" rx="70" ry="60" fill="#F9E3A3" />
              
              {/* 狗耳朵 */}
              <path d="M50,80 Q30,30 60,60" fill="#F9E3A3" strokeWidth="4" />
              <path d="M150,80 Q170,30 140,60" fill="#F9E3A3" strokeWidth="4" />
              
              {/* 狗臉 */}
              <circle cx="80" cy="100" r="6" fill="#000" stroke="none" /> {/* 左眼 */}
              <circle cx="120" cy="100" r="6" fill="#000" stroke="none" /> {/* 右眼 */}
              <circle cx="100" cy="115" r="8" fill="#000" stroke="none" /> {/* 鼻子 */}
              <path d="M70,130 Q100,150 130,130" strokeWidth="4" /> {/* 嘴巴 */}
              
              {/* 小手握餅乾 */}
              <path d="M70,160 Q60,170 70,180" strokeWidth="4" fill="#F9E3A3" />
              <circle cx="70" cy="170" r="12" fill="#B27C4A" strokeWidth="4" /> {/* 餅乾 */}
              <circle cx="65" cy="165" r="2" fill="#000" stroke="none" /> {/* 餅乾點點 */}
              <circle cx="75" cy="170" r="2" fill="#000" stroke="none" /> {/* 餅乾點點 */}
              <circle cx="68" cy="175" r="2" fill="#000" stroke="none" /> {/* 餅乾點點 */}
              
              {/* 尾巴 */}
              <path d="M170,120 Q190,100 180,90" strokeWidth="4" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-amber-400">狗狗肥胖檢測</h1>
          <p className="text-base sm:text-lg text-gray-800 dark:text-amber-200 mt-3">
            你有多胖？這個測試將揭示你內心的肥胖程度。請準備好面對真相，汪！
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-4 border-black w-full">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-amber-400">測試方法</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-800 dark:text-amber-200">
            <li>回答一系列關於你日常生活習慣的問題</li>
            <li>我們會用超科學™的方法分析你的回答</li>
            <li>得出你的肥胖特質分析報告</li>
            <li>接受現實：你就是一隻胖狗</li>
          </ol>
        </div>
        
        <Link 
          href="/test" 
          className="rounded-full border-4 border-black transition-colors bg-amber-300 hover:bg-amber-400 text-black font-bold text-lg sm:text-xl py-3 px-8 sm:py-4 sm:px-10"
        >
          開始測試！汪！
        </Link>
        
        <div className="text-sm text-gray-700 dark:text-amber-300 mt-2 text-center">
          <p>*這個測試純屬娛樂，請勿當真。不過你真的很胖就是了。</p>
        </div>
      </main>
    </div>
  );
}
