"use client";

import React, { createContext, useContext, useState } from 'react';

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
  animation: string;
  bgColor: string;
};

// Define test questions with humorous mind-fattness theme
const testQuestions: Question[] = [
  {
    id: 1,
    text: "看到食物掉地上，你會...",
    options: ["裝作沒看到", "偷偷撿起來吃掉", "舔一舔再放回去", "思考掉地三秒定律與量子力學的關聯"],
    image: "/images/donut.svg",
    animation: "animate-spin-slow",
    bgColor: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    id: 2,
    text: "你心目中的「運動」是...",
    options: ["從沙發滾到地上", "快速移動手指點外送", "一邊看別人健身一邊吃薯片", "夢到自己在跑步"],
    image: "/images/couch.svg",
    animation: "animate-bounce-slow",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    id: 3,
    text: "當朋友說你最近變胖了，你會...",
    options: ["「鏡子都壞掉了」", "「那是我的肌肉在長毛」", "「這是我儲存的幸福感」", "「我只是比較立體而已」"],
    image: "/images/plate.svg",
    animation: "animate-pulse",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  },
  {
    id: 4,
    text: "你最喜歡的蔬菜是...",
    options: ["蔬菜口味的洋芋片", "披薩上的青椒（但會挑出來）", "薯條算蔬菜嗎？", "我的寵物兔子在吃的那種"],
    image: "/images/fries.svg",
    animation: "animate-wiggle",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    id: 5,
    text: "電梯壞掉時，你會...",
    options: ["決定今天不出門了", "原地等待電梯自我修復", "在樓梯間休息十次才上一層", "思考如何用意念控制電梯"],
    image: "/images/elevator.svg",
    animation: "animate-shake",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    id: 6,
    text: "你與體重計的關係是...",
    options: ["它早就神秘失蹤了", "每次都站在角落減重", "我們已經和平分手", "我把它調到顯示比實際輕10公斤"],
    image: "/images/scale.svg",
    animation: "animate-float",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  },
  {
    id: 7,
    text: "你的「料理」定義是...",
    options: ["泡麵加蛋就是高級料理", "外送app訂餐也算自己煮", "會煮開水就好了", "照著食譜做出完全不同的東西"],
    image: "/images/delivery.svg",
    animation: "animate-pulse",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  },
  {
    id: 8,
    text: "夢中的你正在...",
    options: ["吃不完的自助餐", "被一堆小籠包追趕", "變成一隻胖柴犬", "飄浮在珍奶海洋中"],
    image: "/images/dream.svg",
    animation: "animate-float",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
  },
  {
    id: 9,
    text: "如果你是一種動物，你會是...",
    options: ["冬眠中的熊", "整天睡覺的貓", "會把食物藏起來的倉鼠", "只在餵食時出現的魚"],
    image: "/images/sloth.svg",
    animation: "animate-wiggle",
    bgColor: "bg-teal-50 dark:bg-teal-900/20"
  },
  {
    id: 10,
    text: "你覺得「努力」的定義是...",
    options: ["把零食放高處逼自己站起來拿", "同時用四個外送平台點餐比價", "想像自己在跑步就出汗了", "看別人運動影片覺得自己也動了"],
    image: "/images/tv.svg",
    animation: "animate-pulse",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
  }
];

// Context type definition
type TestContextType = {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  setAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  isTestComplete: boolean;
  restartTest: () => void;
  calculateResults: () => Record<string, number>;
};

// Create context
const TestContext = createContext<TestContextType | undefined>(undefined);

// Provider component
export function TestProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const setAnswer = (questionId: number, value: number) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = { questionId, value };
      setAnswers(updatedAnswers);
    } else {
      // Add new answer
      setAnswers([...answers, { questionId, value }]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartTest = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  // Helper to determine if all questions are answered
  const isTestComplete = answers.length === testQuestions.length;

  // Calculate psychological profile based on answers
  const calculateResults = () => {
    // Funny traits for the mind-fattness test
    const traits = {
      "食物執念": 0,
      "運動迴避": 0,
      "自我欺騙": 0,
      "零食創意": 0,
      "整體肥胖": 0,
    };
    
    // Map questions to traits
    const questionTraitMap: Record<number, keyof typeof traits> = {
      1: '食物執念',
      2: '運動迴避',
      3: '自我欺騙',
      4: '食物執念',
      5: '運動迴避',
      6: '自我欺騙',
      7: '零食創意',
      8: '食物執念',
      9: '整體肥胖',
      10: '運動迴避'
    };
    
    // Calculate scores
    answers.forEach(answer => {
      const trait = questionTraitMap[answer.questionId];
      if (trait) {
        // Each answer contributes to the trait score
        traits[trait] += answer.value;
      }
    });
    
    // Normalize scores based on number of questions per trait
    const traitCounts: Record<string, number> = {};
    Object.values(questionTraitMap).forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });
    
    Object.keys(traits).forEach(trait => {
      const count = traitCounts[trait] || 1;
      traits[trait as keyof typeof traits] = Math.round((traits[trait as keyof typeof traits] / (count * 4)) * 100); // Scale to 0-100
    });
    
    // Calculate overall mental fattness
    traits["整體肥胖"] = Math.round(
      (traits["食物執念"] + 
      traits["運動迴避"] + 
      traits["自我欺騙"] + 
      traits["零食創意"]) / 4
    );
    
    return traits;
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