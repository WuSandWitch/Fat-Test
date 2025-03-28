"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our test
export type Answer = {
  questionId: number;
  value: number;
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  image: string;
  bgColor: string;
  imagePath: string;
  traits: Record<string, Record<string, number>>;
};

// 定義結果類型
export type ResultType = {
  title: string;
  subtitle: string;
  description: string;
  advice: string;
  iconPath: string;
  level: number;
  "食物執念": number;
  "運動迴避": number;
  "自我欺騙": number;
  "零食創意": number;
  "整體肥胖": number;
  [key: string]: string | number; // 允許其他屬性存在
};

// Define test questions with humorous mind-fattness theme
const testQuestions: Question[] = [
  {
    "id": 1,
    "text": "你只能在以下四種食物中選一種當作未來三天的主食，你會選？",
    "options": ["冷掉的炸雞", "微波過頭的便利商店義大利麵", "無調味白飯", "每天都一樣的豬肉便當"],
    "image": "/images/foodchoice.svg",
    "bgColor": "bg-orange-50 dark:bg-orange-900/20",
    "imagePath": "/images/q1.png",
    "traits": {
      "1a": { "食物執念": 30 },
      "1b": { "零食創意": 25 },
      "1c": { "自我欺騙": 30 },
      "1d": { "運動迴避": 25 }
    }
  },
  {
    "id": 2,
    "text": "宵夜時間快到了，但你今天說好要減肥，你會？",
    "options": ["打開零食櫃觀察但不吃", "只吃一口，真的只吃一口", "開始搜尋健康的宵夜選項", "乾脆煮碗泡麵壓壓驚"],
    "image": "/images/late-night.svg",
    "bgColor": "bg-yellow-50 dark:bg-yellow-900/20",
    "imagePath": "/images/q2.png",
    "traits": {
      "2a": { "自我欺騙": 25, "零食創意": 5 },
      "2b": { "自我欺騙": 30 },
      "2c": { "運動迴避": 15 },
      "2d": { "食物執念": 30 }
    }
  },
  {
    "id": 3,
    "text": "午餐剩五分鐘就要點，你決定？",
    "options": ["點最熟悉的那家", "滑外送滑到沒時間點", "亂點一個從沒吃過的", "打電話問朋友吃什麼然後跟著點"],
    "image": "/images/lunch.svg",
    "bgColor": "bg-blue-50 dark:bg-blue-900/20",
    "imagePath": "/images/q3.png",
    "traits": {
      "3a": { "運動迴避": 15 },
      "3b": { "自我欺騙": 30 },
      "3c": { "零食創意": 30 },
      "3d": { "食物執念": 25 }
    }
  },
  {
    "id": 4,
    "text": "你早餐店最愛的品項賣完了，老闆推薦你新品，你會？",
    "options": ["堅持等到明天再來買回原味", "勉強接受新品", "改買旁邊的鹽酥雞當早餐", "詢問能不能自己帶料客製化"],
    "image": "/images/breakfast.svg",
    "bgColor": "bg-green-50 dark:bg-green-900/20",
    "imagePath": "/images/q4.png",
    "traits": {
      "4a": { "食物執念": 30 },
      "4b": { "自我欺騙": 25 },
      "4c": { "運動迴避": 20 },
      "4d": { "零食創意": 30 }
    }
  },
  {
    "id": 5,
    "text": "有人問你減肥要吃什麼，你第一個想到的是？",
    "options": ["地瓜 + 雞胸肉", "代餐棒 + 維他命", "泡菜炒飯 + 再減糖可樂", "吃少一點零食就好了吧"],
    "image": "/images/diet.svg",
    "bgColor": "bg-purple-50 dark:bg-purple-900/20",
    "imagePath": "/images/q5.png",
    "traits": {
      "5a": { "運動迴避": 10 },
      "5b": { "自我欺騙": 30 },
      "5c": { "食物執念": 25 },
      "5d": { "自我欺騙": 30, "零食創意": 10 }
    }
  },
  {
    "id": 6,
    "text": "你在 7-11 只能選一種零食帶上無人島，你選？",
    "options": ["鹽味洋芋片", "巧克力夾心餅", "肉乾包", "養生堅果條"],
    "image": "/images/snack.svg",
    "bgColor": "bg-pink-50 dark:bg-pink-900/20",
    "imagePath": "/images/q6.png",
    "traits": {
      "6a": { "零食創意": 30 },
      "6b": { "食物執念": 25 },
      "6c": { "運動迴避": 15 },
      "6d": { "自我欺騙": 30 }
    }
  },
  {
    "id": 7,
    "text": "你點的便當來了，附的醬包你會？",
    "options": ["全擠下去才夠味", "先試吃一口再決定", "留下當作收藏", "拿去配家裡的別的菜"],
    "image": "/images/sauce.svg",
    "bgColor": "bg-gray-50 dark:bg-gray-900/20",
    "imagePath": "/images/q7.png",
    "traits": {
      "7a": { "食物執念": 30 },
      "7b": { "自我欺騙": 15 },
      "7c": { "零食創意": 30 },
      "7d": { "零食創意": 20 }
    }
  },
  {
    "id": 8,
    "text": "你今天只吃一餐，會怎麼處理？",
    "options": ["吃爆當補償", "找高熱量但體積小的東西", "挑自己最愛吃的食物慰藉", "假裝自己在斷食排毒"],
    "image": "/images/onemeal.svg",
    "bgColor": "bg-indigo-50 dark:bg-indigo-900/20",
    "imagePath": "/images/q8.png",
    "traits": {
      "8a": { "食物執念": 25 },
      "8b": { "零食創意": 30 },
      "8c": { "食物執念": 30 },
      "8d": { "自我欺騙": 30 }
    }
  },
  {
    "id": 9,
    "text": "朋友送你一箱奇怪口味的洋芋片，你會？",
    "options": ["每包都試試看", "只挑熟悉的吃", "開來分送大家", "說好收著但默默吃光"],
    "image": "/images/chips.svg",
    "bgColor": "bg-amber-50 dark:bg-amber-900/20",
    "imagePath": "/images/q9.png",
    "traits": {
      "9a": { "零食創意": 30 },
      "9b": { "自我欺騙": 20 },
      "9c": { "食物執念": 15 },
      "9d": { "自我欺騙": 30 }
    }
  },
  {
    "id": 10,
    "text": "你在減脂期突然超想吃炸物，你會？",
    "options": ["查氣炸鍋版本的做法", "吃一點點但說自己還在控制", "看別人吃過癮", "直接買一份大雞排"],
    "image": "/images/friedfood.svg",
    "bgColor": "bg-brown-50 dark:bg-brown-900/20",
    "imagePath": "/images/q10.png",
    "traits": {
      "10a": { "零食創意": 30 },
      "10b": { "自我欺騙": 25 },
      "10c": { "運動迴避": 20 },
      "10d": { "食物執念": 30 }
    }
  }
];

// Context type definition
type TestContextType = {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  setAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  isTestComplete: boolean;
  restartTest: () => void;
  calculateResults: () => ResultType;
};

// Create context
const TestContext = createContext<TestContextType | undefined>(undefined);

// Provider component
export function TestProvider({ children }: { children: React.ReactNode }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  
  // 從本地存儲恢復狀態
  useEffect(() => {
    const savedState = localStorage.getItem('testState');
    if (savedState) {
      const { answers, currentQuestionIndex, isTestComplete } = JSON.parse(savedState);
      setAnswers(answers || {});
      setCurrentQuestionIndex(currentQuestionIndex || 0);
      setIsTestComplete(isTestComplete || false);
    }
  }, []);
  
  // 保存狀態到本地存儲
  useEffect(() => {
    localStorage.setItem('testState', JSON.stringify({
      answers,
      currentQuestionIndex,
      isTestComplete
    }));
  }, [answers, currentQuestionIndex, isTestComplete]);
  
  // 設置答案
  const setAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  // 下一個問題
  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (Object.keys(answers).length === testQuestions.length) {
      setIsTestComplete(true);
    }
  };
  
  // 上一個問題
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // 重新開始測試
  const restartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsTestComplete(false);
  };
  
  // 計算結果
  const calculateResults = () => {
    // 初始化特質分數
    const traits: Record<string, number> = {
      "食物執念": 0,
      "運動迴避": 0,
      "自我欺騙": 0,
      "零食創意": 0
    };
    
    // 總共可能的分數
    const maxScores: Record<string, number> = {
      "食物執念": 0,
      "運動迴避": 0,
      "自我欺騙": 0,
      "零食創意": 0
    };
    
    // 計算每個特質的最大可能分數
    testQuestions.forEach(q => {
      Object.keys(q.traits).forEach(optionKey => {
        const traitValues = q.traits[optionKey];
        if (traitValues) {
          Object.entries(traitValues).forEach(([trait, value]) => {
            maxScores[trait] = (maxScores[trait] || 0) + value;
          });
        }
      });
    });
    
    // 基於答案計算特質分數
    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = testQuestions.find(q => q.id.toString() === questionId);
      if (question) {
        // 查詢並組合特質鍵
        const optionIndex = parseInt(optionId) - 1;
        if (optionIndex >= 0 && optionIndex < question.options.length) {
          const traitKey = `${questionId}${String.fromCharCode(97 + optionIndex)}`;
          const traitValues = question.traits[traitKey];
          if (traitValues) {
            Object.entries(traitValues).forEach(([trait, value]) => {
              traits[trait] = (traits[trait] || 0) + value;
            });
          }
        }
      }
    });
    
    // 將分數轉換為百分比
    const results: Record<string, number> = {};
    Object.entries(traits).forEach(([trait, score]) => {
      const maxScore = maxScores[trait] || 100;
      results[trait] = Math.round((score / maxScore) * 100);
    });
    
    // 計算整體肥胖分數
    const totalScore = Object.values(results).reduce((sum, score) => sum + score, 0);
    const avgScore = Math.round(totalScore / Object.keys(results).length);
    results["整體肥胖"] = avgScore;
    
    // 決定等級和性格描述
    let title = "微胖狗";
    let level = 1;
    
    if (avgScore > 80) {
      title = "超級胖狗";
      level = 5;
    } else if (avgScore > 60) {
      title = "大胖狗";
      level = 4;
    } else if (avgScore > 40) {
      title = "中胖狗";
      level = 3;
    } else if (avgScore > 20) {
      title = "小胖狗";
      level = 2;
    } else {
      title = "微胖狗";
      level = 1;
    }
    
    return {
      title: title,
      subtitle: `肥胖指數：${avgScore}%`,
      description: `你的食物執念：${results["食物執念"]}%\n你的運動迴避：${results["運動迴避"]}%\n你的自我欺騙：${results["自我欺騙"]}%\n你的零食創意：${results["零食創意"]}%`,
      advice: `"不是你胖，只是你吃太多餅乾了。汪！"\n– 肥胖研究院`,
      iconPath: "/images/fat-dog.png",
      level: level,
      "食物執念": results["食物執念"] || 0,
      "運動迴避": results["運動迴避"] || 0,
      "自我欺騙": results["自我欺騙"] || 0,
      "零食創意": results["零食創意"] || 0,
      "整體肥胖": avgScore
    } as ResultType;
  };

  return (
    <TestContext.Provider value={{
      questions: testQuestions,
      currentQuestionIndex,
      answers,
      setAnswer,
      nextQuestion,
      previousQuestion,
      isTestComplete,
      restartTest,
      calculateResults
    }}>
      {children}
    </TestContext.Provider>
  );
}

// Custom hook to use the test context
export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
} 