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
  advice: string;
  iconPath: string;
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
      "1a": { "食物執念": 85, "運動迴避": 78, "自我欺騙": 82, "零食創意": 75 },
      "1b": { "食物執念": 80, "運動迴避": 75, "自我欺騙": 90, "零食創意": 83 },
      "1c": { "食物執念": 82, "運動迴避": 88, "自我欺騙": 78, "零食創意": 76 },
      "1d": { "食物執念": 86, "運動迴避": 85, "自我欺騙": 80, "零食創意": 82 }
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
      "2a": { "食物執念": 78, "運動迴避": 82, "自我欺騙": 90, "零食創意": 76 },
      "2b": { "食物執念": 85, "運動迴避": 77, "自我欺騙": 95, "零食創意": 80 },
      "2c": { "食物執念": 75, "運動迴避": 85, "自我欺騙": 82, "零食創意": 79 },
      "2d": { "食物執念": 92, "運動迴避": 79, "自我欺騙": 85, "零食創意": 87 }
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
      "3a": { "食物執念": 83, "運動迴避": 87, "自我欺騙": 76, "零食創意": 79 },
      "3b": { "食物執念": 77, "運動迴避": 85, "自我欺騙": 93, "零食創意": 81 },
      "3c": { "食物執念": 80, "運動迴避": 78, "自我欺騙": 84, "零食創意": 91 },
      "3d": { "食物執念": 88, "運動迴避": 79, "自我欺騙": 82, "零食創意": 85 }
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
      "4a": { "食物執念": 93, "運動迴避": 81, "自我欺騙": 79, "零食創意": 76 },
      "4b": { "食物執念": 79, "運動迴避": 84, "自我欺騙": 88, "零食創意": 78 },
      "4c": { "食物執念": 86, "運動迴避": 89, "自我欺騙": 82, "零食創意": 83 },
      "4d": { "食物執念": 84, "運動迴避": 77, "自我欺騙": 80, "零食創意": 94 }
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
      "5a": { "食物執念": 76, "運動迴避": 87, "自我欺騙": 85, "零食創意": 79 },
      "5b": { "食物執念": 78, "運動迴避": 82, "自我欺騙": 92, "零食創意": 85 },
      "5c": { "食物執念": 89, "運動迴避": 80, "自我欺騙": 83, "零食創意": 86 },
      "5d": { "食物執念": 82, "運動迴避": 84, "自我欺騙": 97, "零食創意": 88 }
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
      "6a": { "食物執念": 85, "運動迴避": 80, "自我欺騙": 78, "零食創意": 93 },
      "6b": { "食物執念": 90, "運動迴避": 79, "自我欺騙": 82, "零食創意": 86 },
      "6c": { "食物執念": 87, "運動迴避": 84, "自我欺騙": 79, "零食創意": 82 },
      "6d": { "食物執念": 78, "運動迴避": 81, "自我欺騙": 94, "零食創意": 83 }
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
      "7a": { "食物執念": 95, "運動迴避": 82, "自我欺騙": 78, "零食創意": 81 },
      "7b": { "食物執念": 81, "運動迴避": 83, "自我欺騙": 87, "零食創意": 80 },
      "7c": { "食物執念": 79, "運動迴避": 80, "自我欺騙": 82, "零食創意": 92 },
      "7d": { "食物執念": 83, "運動迴避": 85, "自我欺騙": 79, "零食創意": 89 }
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
      "8a": { "食物執念": 92, "運動迴避": 81, "自我欺騙": 79, "零食創意": 83 },
      "8b": { "食物執念": 85, "運動迴避": 78, "自我欺騙": 83, "零食創意": 94 },
      "8c": { "食物執念": 94, "運動迴避": 80, "自我欺騙": 85, "零食創意": 81 },
      "8d": { "食物執念": 80, "運動迴避": 85, "自我欺騙": 96, "零食創意": 78 }
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
      "9a": { "食物執念": 83, "運動迴避": 78, "自我欺騙": 81, "零食創意": 95 },
      "9b": { "食物執念": 81, "運動迴避": 82, "自我欺騙": 88, "零食創意": 77 },
      "9c": { "食物執念": 77, "運動迴避": 80, "自我欺騙": 82, "零食創意": 84 },
      "9d": { "食物執念": 83, "運動迴避": 79, "自我欺騙": 96, "零食創意": 82 }
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
      "10a": { "食物執念": 84, "運動迴避": 79, "自我欺騙": 85, "零食創意": 96 },
      "10b": { "食物執念": 82, "運動迴避": 80, "自我欺騙": 97, "零食創意": 81 },
      "10c": { "食物執念": 79, "運動迴避": 92, "自我欺騙": 83, "零食創意": 78 },
      "10d": { "食物執念": 97, "運動迴避": 85, "自我欺騙": 80, "零食創意": 83 }
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
    
    // 清除本地存儲中的測驗狀態
    localStorage.removeItem('testState');
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
    
    // 計數器，記錄每個特質有多少個分數被計入
    const counters: Record<string, number> = {
      "食物執念": 0,
      "運動迴避": 0,
      "自我欺騙": 0,
      "零食創意": 0
    };
    
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
              counters[trait] = (counters[trait] || 0) + 1;
            });
          }
        }
      }
    });
    
    // 計算平均分數
    const results: Record<string, number> = {};
    Object.entries(traits).forEach(([trait, score]) => {
      // 如果某個特質沒有計入分數，設為 0
      if (counters[trait] === 0) {
        results[trait] = 0;
      } else {
        // 否則計算平均值
        results[trait] = Math.round(score / counters[trait]);
      }
    });
    
    // 計算整體肥胖分數 (四個特質的平均)
    const totalScore = Object.values(results).reduce((sum, score) => sum + score, 0);
    const avgScore = Math.round(totalScore / Object.keys(results).length);
    
    // 使用 avgScore % 5 決定等級和性格描述
    const remainder = avgScore % 5;
    let title = "";
    let advice = "";
    
    switch(remainder) {
      case 0:
        title = "肥豬胖狗！";
        advice = "又豬又狗，點點點";
        break;
      case 1:
        title = "超巨胖狗！";
        advice = "我知道五隻胖狗裡面你就佔了四隻、、";
        break;
      case 2:
        title = "十分胖胖狗！";
        advice = "滿分十分🤏🤏";
        break;
      case 3:
        title = "超級胖胖狗！";
        advice = "從你左邊走到右邊要叫 Uber";
        break;
      case 4:
      default:
        title = "吃貨胖狗！";
        advice = "不是你胖，只是你吃太多餅乾了！汪！";
        break;
    }
    
    return {
      title: title,
      advice: advice,
      iconPath: "/images/fat-dog.png",
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