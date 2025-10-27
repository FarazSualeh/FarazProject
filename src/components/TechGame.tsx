import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Trophy, Cpu, Monitor, Code, Smartphone } from "lucide-react";

interface TechGameProps {
  language: string;
  onBack: () => void;
}

const translations = {
  en: {
    title: "Tech Builder",
    score: "Score",
    level: "Level",
    buildComputer: "Build a Computer!",
    codingPuzzle: "Coding Puzzle",
    deviceMatch: "Device Match",
    gameOver: "Game Over!",
    finalScore: "Final Score",
    playAgain: "Play Again",
    backToDashboard: "Back to Dashboard",
    correct: "Correct!",
    wrong: "Wrong!",
    instructions: "Learn about computers and digital technology",
    pointsEarned: "points earned!",
    wellDone: "Well Done!",
    newLevel: "New Level Unlocked!",
    nextLevel: "Next Level",
    step: "Step",
    component: "Component",
    function: "Function",
    techMaster: "Tech Master!"
  },
  hi: {
    title: "टेक बिल्डर",
    score: "स्कोर",
    level: "स्तर",
    buildComputer: "कंप्यूटर बनाएं!",
    codingPuzzle: "कोडिंग पहेली",
    deviceMatch: "उपकरण मिलान",
    gameOver: "खेल समाप्त!",
    finalScore: "अंतिम स्कोर",
    playAgain: "फिर खेलें",
    backToDashboard: "डैशबोर्ड पर वापस",
    correct: "सही!",
    wrong: "गलत!",
    instructions: "कंप्यूटर और डिजिटल तकनीक के बारे में जानें",
    pointsEarned: "अंक अर्जित!",
    wellDone: "बहुत अच्छा!",
    newLevel: "नया स्तर खुला!",
    nextLevel: "अगला स्तर",
    step: "चरण",
    component: "घटक",
    function: "कार्य",
    techMaster: "टेक मास्टर!"
  },
  od: {
    title: "ଟେକ୍ ନିର୍ମାତା",
    score: "ସ୍କୋର",
    level: "ସ୍ତର",
    buildComputer: "କମ୍ପ୍ୟୁଟର ନିର୍ମାଣ କରନ୍ତୁ!",
    codingPuzzle: "କୋଡିଂ ପଜଲ୍",
    deviceMatch: "ଡିଭାଇସ୍ ମେଳ",
    gameOver: "ଖେଳ ସମାପ୍ତ!",
    finalScore: "ଅନ୍ତିମ ସ୍କୋର",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    correct: "ସଠିକ୍!",
    wrong: "ଭୁଲ!",
    instructions: "କମ୍ପ୍ୟୁଟର ଏବଂ ଡିଜିଟାଲ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ବିଷୟରେ ଶିଖନ୍ତୁ!",
    pointsEarned: "ପଏଣ୍ଟ ଅର୍ଜନ!",
    wellDone: "ବହୁତ ଭଲ!",
    newLevel: "ନୂତନ ସ୍ତର ଖୋଲିଗଲା!",
    nextLevel: "ପରବର୍ତ୍ତୀ ସ୍ତର",
    step: "ପଦକ୍ଷେପ",
    component: "ଉପାଦାନ",
    function: "କାର୍ଯ୍ୟ",
    techMaster: "ଟେକ୍ ମାଷ୍ଟର!"
  }
};

const gameData = {
  computerBuild: [
    { component: "Power Supply", order: 1, icon: "🔌", function: "Provides electricity" },
    { component: "Motherboard", order: 2, icon: "🔧", function: "Connects all parts" },
    { component: "CPU", order: 3, icon: "💾", function: "Processes information" },
    { component: "RAM", order: 4, icon: "📊", function: "Stores temporary data" },
    { component: "Storage", order: 5, icon: "💿", function: "Saves files permanently" },
    { component: "Graphics Card", order: 6, icon: "🎮", function: "Renders images" }
  ],
  codingSequence: [
    { step: "Input", order: 1, icon: "⌨️", description: "Get data from user" },
    { step: "Process", order: 2, icon: "⚙️", description: "Perform calculations" },
    { step: "Store", order: 3, icon: "💾", description: "Save the result" },
    { step: "Output", order: 4, icon: "📺", description: "Show result to user" }
  ],
  devices: [
    { device: "Smartphone", use: "Communication", icon: "📱" },
    { device: "Laptop", use: "Computing", icon: "💻" },
    { device: "Tablet", use: "Media & Reading", icon: "📱" },
    { device: "Smart Watch", use: "Health Tracking", icon: "⌚" },
    { device: "Router", use: "Internet Connection", icon: "📡" },
    { device: "Printer", use: "Document Printing", icon: "🖨️" }
  ]
};

export function TechGame({ language, onBack }: TechGameProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameType, setGameType] = useState<'computer' | 'coding' | 'devices'>('computer');
  const [currentSequence, setCurrentSequence] = useState<any[]>([]);
  const [userSequence, setUserSequence] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Ensure language is valid, default to 'en'
  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;

  const initializeGame = () => {
    let sequence: any[] = [];
    let items: any[] = [];

    switch (gameType) {
      case 'computer':
        sequence = [...gameData.computerBuild].slice(0, Math.min(3 + level, 6));
        break;
      case 'coding':
        sequence = [...gameData.codingSequence];
        break;
      case 'devices':
        sequence = gameData.devices.slice(0, Math.min(4 + level, 6));
        break;
    }

    items = [...sequence].sort(() => Math.random() - 0.5);
    
    setCurrentSequence(sequence);
    setAvailableItems(items);
    setUserSequence([]);
  };

  const handleItemClick = (item: any) => {
    // Move item from available to user sequence
    setAvailableItems(prev => prev.filter(i => i !== item));
    setUserSequence(prev => [...prev, item]);
  };

  const handleRemoveFromSequence = (index: number) => {
    const item = userSequence[index];
    setUserSequence(prev => prev.filter((_, i) => i !== index));
    setAvailableItems(prev => [...prev, item]);
  };

  const checkSequence = () => {
    let isCorrect = false;
    
    if (gameType === 'computer' || gameType === 'coding') {
      isCorrect = userSequence.every((item, index) => 
        item.order === currentSequence[index].order
      );
    } else if (gameType === 'devices') {
      isCorrect = userSequence.length === currentSequence.length;
    }

    if (isCorrect && userSequence.length === currentSequence.length) {
      const points = level * 20;
      setScore(score + points);
      setFeedback(`${t.correct} +${points} ${t.pointsEarned}`);
      
      setTimeout(() => {
        if (level < 3) {
          setFeedback(t.newLevel);
          setTimeout(() => {
            setLevel(level + 1);
            setGameType(level === 1 ? 'coding' : 'devices');
            initializeGame();
            setShowFeedback(false);
          }, 2000);
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback(t.wrong);
    }
    
    setShowFeedback(true);
    if (!isCorrect || userSequence.length !== currentSequence.length) {
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameType('computer');
    setGameComplete(false);
    setFeedback('');
    setShowFeedback(false);
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
  }, [gameType, level]);

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">{t.gameOver}</CardTitle>
            <CardDescription>{t.wellDone}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl">{score}</div>
            <p className="text-sm text-gray-600">{t.finalScore}</p>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Cpu className="mx-auto w-8 h-8 text-purple-500 mb-2" />
              <p className="text-purple-700">{t.techMaster}</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame}>
                {t.playAgain}
              </Button>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToDashboard}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGameTitle = () => {
    switch (gameType) {
      case 'computer': return t.buildComputer;
      case 'coding': return t.codingPuzzle;
      case 'devices': return t.deviceMatch;
      default: return t.title;
    }
  };

  const getGameIcon = () => {
    switch (gameType) {
      case 'computer': return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'coding': return <Code className="w-5 h-5 text-green-500" />;
      case 'devices': return <Smartphone className="w-5 h-5 text-purple-500" />;
      default: return <Cpu className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">{t.title}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {t.level} {level}
              </Badge>
              <Badge variant="secondary">
                {t.score}: {score}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            {getGameIcon()}
            <h2 className="text-xl">{getGameTitle()}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Items */}
          <Card>
            <CardHeader>
              <CardTitle>Available {gameType === 'devices' ? 'Devices' : 'Components'}</CardTitle>
              <CardDescription>{t.instructions}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {availableItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 flex items-center justify-start p-4 hover:scale-105 transition-transform"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="text-sm">
                          {item.component || item.step || item.device}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.function || item.description || item.use}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Sequence */}
          <Card>
            <CardHeader>
              <CardTitle>Your Sequence</CardTitle>
              <CardDescription>
                {gameType === 'computer' && "Build computer in correct order"}
                {gameType === 'coding' && "Arrange coding steps correctly"}
                {gameType === 'devices' && "Match devices with their uses"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showFeedback && (
                <div className={`text-lg text-center mb-4 p-3 rounded-lg ${
                  feedback.includes(t.correct) ? 'bg-green-100 text-green-700' : 
                  feedback.includes(t.newLevel) ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {feedback}
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                {userSequence.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRemoveFromSequence(index)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-sm">
                          {item.component || item.step || item.device}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.function || item.description || item.use}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {userSequence.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    Click items from the left to build your sequence
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Progress value={(userSequence.length / currentSequence.length) * 100} />
                <p className="text-center text-sm text-gray-600">
                  {userSequence.length} / {currentSequence.length} items placed
                </p>
                
                {userSequence.length === currentSequence.length && !showFeedback && (
                  <Button 
                    onClick={checkSequence}
                    className="w-full"
                    size="lg"
                  >
                    Check Sequence
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}