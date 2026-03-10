import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Star,
  Info,
  Sparkles,
  HelpCircle,
  Undo2
} from 'lucide-react';

// --- Types ---

interface Question {
  id: number;
  phraseArm: string;
  correctSp: string; // The full correct sentence
  words: string[];   // The words to be scrambled
  explanation: string;
}

// --- Data ---

const QUIZ_DATA: Question[] = [
  { 
    id: 1, 
    phraseArm: "Այս աղջիկը", 
    correctSp: "Esta chica", 
    words: ["Esta", "chica", "Está"], 
    explanation: "'Esta' (առանց շեշտի) նշանակում է «Այս»:" 
  },
  { 
    id: 2, 
    phraseArm: "Նա տանն է", 
    correctSp: "Ella está en casa", 
    words: ["Ella", "está", "en", "casa", "esta"], 
    explanation: "'Está' (շեշտով) նշանակում է «Գտնվում է / Է»:" 
  },
  { 
    id: 3, 
    phraseArm: "Այս սեղանը", 
    correctSp: "Esta mesa", 
    words: ["Esta", "mesa", "Está"], 
    explanation: "'Esta' օգտագործվում է որպես ցուցական որոշիչ (Այս):" 
  },
  { 
    id: 4, 
    phraseArm: "Որտե՞ղ է Մարիան", 
    correctSp: "¿Dónde está María?", 
    words: ["¿Dónde", "está", "María?", "esta"], 
    explanation: "Գտնվելու վայրի համար օգտագործվում է 'Está' (շեշտով):" 
  },
  { 
    id: 5, 
    phraseArm: "Այս երգը", 
    correctSp: "Esta canción", 
    words: ["Esta", "canción", "Está"], 
    explanation: "'Esta' (Այս) + գոյական:" 
  },
  { 
    id: 6, 
    phraseArm: "Սուրճը տաք է", 
    correctSp: "El café está caliente", 
    words: ["El", "café", "está", "caliente", "esta"], 
    explanation: "Վիճակ նկարագրելու համար օգտագործվում է 'Está':" 
  },
  { 
    id: 7, 
    phraseArm: "Այս էջը", 
    correctSp: "Esta página", 
    words: ["Esta", "página", "Está"], 
    explanation: "'Esta' (Այս) + գոյական:" 
  },
  { 
    id: 8, 
    phraseArm: "Հեռախոսը սեղանի վրա է", 
    correctSp: "El teléfono está en la mesa", 
    words: ["El", "teléfono", "está", "en", "la", "mesa", "esta"], 
    explanation: "Տեղադրության համար միշտ 'Está':" 
  },
  { 
    id: 9, 
    phraseArm: "Այս լամպը", 
    correctSp: "Esta lámpara", 
    words: ["Esta", "lámpara", "Está"], 
    explanation: "'Esta' (Այս) + գոյական:" 
  },
  { 
    id: 10, 
    phraseArm: "Խուանը հիվանդ է", 
    correctSp: "Juan está enfermo", 
    words: ["Juan", "está", "enfermo", "esta"], 
    explanation: "Առողջական վիճակի համար օգտագործվում է 'Está':" 
  }
];

// Helper to shuffle array
const shuffle = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<{word: string, originalIdx: number}[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);

  const currentQuestion = QUIZ_DATA[currentIdx];
  const progress = ((currentIdx + 1) / QUIZ_DATA.length) * 100;

  // Initialize shuffled words for current question
  useEffect(() => {
    setShuffledWords(shuffle(currentQuestion.words));
    setSelectedWords([]);
    setIsCorrect(null);
  }, [currentIdx]);

  const handleWordClick = (word: string, idx: number) => {
    if (isCorrect !== null) return;
    
    // If word is already selected, don't add it again from the bank
    if (selectedWords.some(sw => sw.originalIdx === idx)) return;

    setSelectedWords(prev => [...prev, { word, originalIdx: idx }]);
  };

  const handleRemoveWord = (idxInSelected: number) => {
    if (isCorrect !== null) return;
    setSelectedWords(prev => prev.filter((_, i) => i !== idxInSelected));
  };

  const checkAnswer = () => {
    const resultString = selectedWords.map(sw => sw.word).join(' ');
    const correct = resultString === currentQuestion.correctSp;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#1e40af] bg-gradient-to-b from-[#1e40af] to-[#3b82f6] flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-blue-200" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Esta vs Está</h1>
          </div>
          <div className="text-sm font-bold bg-white/20 px-4 py-2 rounded-full border border-white/30">
            {currentIdx + 1} / {QUIZ_DATA.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-4 max-w-2xl mx-auto w-full overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full -z-10" />

        {/* Theory Section (Only on first question) */}
        {!showResults && currentIdx === 0 && selectedWords.length === 0 && isCorrect === null && (
          <motion.section 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full mb-6 bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">Կանոններ</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="font-black text-blue-300 text-lg mb-1">Esta</p>
                <p className="text-blue-100 italic text-xs">«Այս» (իգական)</p>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="font-black text-blue-300 text-lg mb-1">Está</p>
                <p className="text-blue-100 italic text-xs">«Գտնվում է / Է»</p>
              </div>
            </div>
          </motion.section>
        )}

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentIdx}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl flex flex-col gap-8">
                
                {/* Armenian Phrase */}
                <div className="text-center space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Կազմեք նախադասությունը</span>
                  <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white drop-shadow-lg">
                    {currentQuestion.phraseArm}
                  </h2>
                </div>

                {/* Result Area */}
                <div className="min-h-[80px] w-full bg-black/20 rounded-3xl p-4 flex flex-wrap gap-2 items-center justify-center border-2 border-dashed border-white/10">
                  {selectedWords.length === 0 && isCorrect === null && (
                    <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Ընտրեք բառերը...</span>
                  )}
                  {selectedWords.map((sw, i) => (
                    <motion.button
                      layoutId={`word-${sw.originalIdx}`}
                      key={`selected-${i}`}
                      onClick={() => handleRemoveWord(i)}
                      className={`px-4 py-2 rounded-xl font-bold text-lg shadow-lg border transition-all ${
                        isCorrect === null 
                          ? 'bg-white text-[#1e40af] border-white hover:scale-105' 
                          : isCorrect 
                            ? 'bg-green-500 text-white border-green-400' 
                            : 'bg-red-500 text-white border-red-400'
                      }`}
                    >
                      {sw.word}
                    </motion.button>
                  ))}
                </div>

                {/* Word Bank Area */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {shuffledWords.map((word, i) => {
                    const isUsed = selectedWords.some(sw => sw.originalIdx === i);
                    
                    return (
                      <div key={`bank-container-${i}`} className="relative">
                        {/* The "Gray Block" placeholder that stays in place */}
                        <div 
                          className={`px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-transparent select-none font-bold text-lg`}
                        >
                          {word}
                        </div>
                        
                        {/* The actual clickable word button */}
                        {!isUsed && (
                          <motion.button
                            layoutId={`word-${i}`}
                            onClick={() => handleWordClick(word, i)}
                            className="absolute inset-0 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-lg shadow-md hover:bg-white/30 transition-colors active:scale-95"
                          >
                            {word}
                          </motion.button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons & Feedback */}
                <div className="flex flex-col gap-4">
                  {isCorrect === null ? (
                    <button
                      onClick={checkAnswer}
                      disabled={selectedWords.length === 0}
                      className="w-full py-5 bg-white text-[#1e40af] rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      Ստուգել
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div className={`p-5 rounded-2xl flex flex-col gap-2 ${
                        isCorrect ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 font-black">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          <span>{isCorrect ? 'Ճիշտ է!' : 'Սխալ է:'}</span>
                        </div>
                        {!isCorrect && <p className="text-sm font-bold">Ճիշտ տարբերակը՝ {currentQuestion.correctSp}</p>}
                        <p className="text-xs opacity-90 font-medium leading-relaxed mt-1">{currentQuestion.explanation}</p>
                      </div>
                      
                      <button
                        onClick={nextQuestion}
                        className="w-full py-5 bg-white text-[#1e40af] rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {currentIdx === QUIZ_DATA.length - 1 ? 'Արդյունքներ' : 'Հաջորդը'}
                        <ArrowRight className="w-6 h-6" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-[40px] p-12 border border-white/20 shadow-2xl text-center w-full"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1e40af] shadow-2xl">
                  <Trophy className="w-12 h-12" />
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border-2 border-dashed border-white/30 rounded-full"
                />
              </div>

              <h2 className="text-4xl font-black mb-4">Ավարտվեց:</h2>
              <div className="flex items-center justify-center gap-2 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-8 h-8 ${i < Math.round((score/10)*5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                ))}
              </div>

              <p className="text-xl text-blue-100 mb-10">
                Դուք հավաքեցիք <span className="text-white font-black text-4xl">{score}</span> միավոր {QUIZ_DATA.length}-ից:
              </p>
              
              <button
                onClick={resetQuiz}
                className="w-full py-5 bg-white text-[#1e40af] rounded-[24px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Կրկնել թեստը
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-[10px] font-bold tracking-widest uppercase">
        Իսպաներենի Դասընթաց • Esta vs Está
      </footer>
    </div>
  );
}
