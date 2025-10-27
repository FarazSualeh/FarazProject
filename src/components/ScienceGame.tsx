import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Trophy, Atom, Shuffle } from "lucide-react";

interface ScienceGameProps {
  language: string;
  onBack: () => void;
}

const translations = {
  en: {
    title: "Science Explorer",
    score: "Score",
    level: "Level",
    matchElements: "Match the Elements!",
    bodyParts: "Body Parts Match",
    solarSystem: "Solar System Quiz",
    gameOver: "Game Over!",
    finalScore: "Final Score",
    playAgain: "Play Again",
    backToDashboard: "Back to Dashboard",
    correct: "Correct!",
    wrong: "Wrong!",
    instructions: "Drag and drop items to their correct matches!",
    pointsEarned: "points earned!",
    wellDone: "Well Done!",
    newLevel: "New Level Unlocked!",
    nextLevel: "Next Level",
    symbol: "Symbol",
    name: "Name",
    element: "Element"
  },
  hi: {
    title: "विज्ञान अन्वेषक",
    score: "स्कोर",
    level: "स्तर",
    matchElements: "तत्वों का मिलान करें!",
    bodyParts: "शरीर के अंगों का मिलान",
    solarSystem: "सौर मंडल प्रश्नोत्तरी",
    gameOver: "खेल समाप्त!",
    finalScore: "अंतिम स्कोर",
    playAgain: "फिर खेलें",
    backToDashboard: "डैशबोर्ड पर वापस",
    correct: "सही!",
    wrong: "गलत!",
    instructions: "वस्तुओं को उनके सही मिलान में खींचें और छोड़ें!",
    pointsEarned: "अंक अर्जित!",
    wellDone: "बहुत अच्छा!",
    newLevel: "नया स्तर खुला!",
    nextLevel: "अगला स्तर",
    symbol: "प्रतीक",
    name: "नाम",
    element: "तत्व"
  },
  od: {
    title: "ବିଜ୍ଞାନ ଅନ୍ବେଷଣକାରୀ",
    score: "ସ୍କୋର",
    level: "ସ୍ତର",
    matchElements: "ତତ୍ତ୍ୱଗୁଡ଼ିକୁ ମେଳ କରନ୍ତୁ!",
    bodyParts: "ଶରୀରର ଅଙ୍ଗ ମେଳ",
    solarSystem: "ସୌର ମଣ୍ଡଳ କୁଇଜ୍",
    gameOver: "ଖେଳ ସମାପ୍ତ!",
    finalScore: "ଅନ୍ତିମ ସ୍କୋର",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    correct: "ସଠିକ୍!",
    wrong: "ଭୁଲ!",
    instructions: "ବସ୍ତୁଗୁଡ଼ିକୁ ସେମାନଙ୍କର ସଠିକ୍ ମେଳରେ ଟାଣି ଛାଡ଼ନ୍ତୁ!",
    pointsEarned: "ପଏଣ୍ଟ ଅର୍ଜନ!",
    wellDone: "ବହୁତ ଭଲ!",
    newLevel: "ନୂତନ ସ୍ତର ଖୋଲିଗଲା!",
    nextLevel: "ପରବର୍ତ୍ତୀ ସ୍ତର",
    symbol: "ପ୍ରତୀକ",
    name: "ନାମ",
    element: "ତତ୍ତ୍ୱ"
  }
};

const gameData = {
  elements: [
    { symbol: 'H', name: 'Hydrogen', id: 1 },
    { symbol: 'He', name: 'Helium', id: 2 },
    { symbol: 'O', name: 'Oxygen', id: 3 },
    { symbol: 'C', name: 'Carbon', id: 4 },
    { symbol: 'N', name: 'Nitrogen', id: 5 },
    { symbol: 'Ca', name: 'Calcium', id: 6 },
    { symbol: 'Fe', name: 'Iron', id: 7 },
    { symbol: 'Au', name: 'Gold', id: 8 }
  ],
  bodyParts: [
    { organ: 'Heart', function: 'Pumps blood', id: 1 },
    { organ: 'Lungs', function: 'Help us breathe', id: 2 },
    { organ: 'Brain', function: 'Controls thinking', id: 3 },
    { organ: 'Stomach', function: 'Digests food', id: 4 },
    { organ: 'Eyes', function: 'Help us see', id: 5 },
    { organ: 'Ears', function: 'Help us hear', id: 6 }
  ],
  planets: [
    { planet: 'Mercury', order: 1, fact: 'Closest to Sun' },
    { planet: 'Venus', order: 2, fact: 'Hottest planet' },
    { planet: 'Earth', order: 3, fact: 'Our home planet' },
    { planet: 'Mars', order: 4, fact: 'The red planet' },
    { planet: 'Jupiter', order: 5, fact: 'Largest planet' },
    { planet: 'Saturn', order: 6, fact: 'Has beautiful rings' }
  ]
};

export function ScienceGame({ language, onBack }: ScienceGameProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameType, setGameType] = useState<'elements' | 'bodyParts' | 'planets'>('elements');
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const [matches, setMatches] = useState<{[key: number]: boolean}>({});
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Ensure language is valid, default to 'en'
  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;

  const initializeGame = () => {
    let items: any[] = [];
    let options: any[] = [];

    switch (gameType) {
      case 'elements':
        items = gameData.elements.slice(0, Math.min(4 + level, 8));
        options = items.map(item => ({ ...item, type: 'name' }))
          .concat(items.map(item => ({ ...item, type: 'symbol' })));
        break;
      case 'bodyParts':
        items = gameData.bodyParts.slice(0, Math.min(3 + level, 6));
        options = items.map(item => ({ ...item, type: 'organ' }))
          .concat(items.map(item => ({ ...item, type: 'function' })));
        break;
      case 'planets':
        items = gameData.planets.slice(0, Math.min(3 + level, 6));
        options = items.map(item => ({ ...item, type: 'planet' }))
          .concat(items.map(item => ({ ...item, type: 'fact' })));
        break;
    }

    setCurrentItems(items);
    setShuffledOptions(shuffleArray(options));
    setMatches({});
    setSelectedItem(null);
  };

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleItemClick = (item: any) => {
    if (selectedItem) {
      // Check if it's a valid match
      const isMatch = selectedItem.id === item.id && selectedItem.type !== item.type;
      
      if (isMatch) {
        setMatches(prev => ({ ...prev, [item.id]: true }));
        setScore(score + (level * 10));
        setFeedback(`${t.correct} +${level * 10} ${t.pointsEarned}`);
        
        // Check if all matches are complete
        if (Object.keys(matches).length + 1 === currentItems.length) {
          setTimeout(() => {
            if (level < 3) {
              setFeedback(`${t.newLevel}`);
              setTimeout(() => {
                setLevel(level + 1);
                setGameType(level === 1 ? 'bodyParts' : 'planets');
                initializeGame();
                setShowFeedback(false);
              }, 2000);
            } else {
              setGameComplete(true);
            }
          }, 1500);
        }
      } else {
        setFeedback(t.wrong);
      }
      
      setShowFeedback(true);
      setSelectedItem(null);
      setTimeout(() => setShowFeedback(false), 1500);
    } else {
      setSelectedItem(item);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameType('elements');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">{t.gameOver}</CardTitle>
            <CardDescription>{t.wellDone}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl">{score}</div>
            <p className="text-sm text-gray-600">{t.finalScore}</p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Star className="mx-auto w-8 h-8 text-green-500 mb-2" />
              <p className="text-green-700">Science Master!</p>
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
      case 'elements': return t.matchElements;
      case 'bodyParts': return t.bodyParts;
      case 'planets': return t.solarSystem;
      default: return t.title;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
            <Atom className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl">{getGameTitle()}</h2>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardDescription className="text-center">{t.instructions}</CardDescription>
          </CardHeader>
          <CardContent>
            {showFeedback && (
              <div className={`text-xl text-center mb-6 p-4 rounded-lg ${
                feedback.includes(t.correct) ? 'bg-green-100 text-green-700' : 
                feedback.includes(t.newLevel) ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {feedback}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shuffledOptions.map((item, index) => {
                const isMatched = matches[item.id];
                const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : isMatched ? "secondary" : "outline"}
                    className={`h-24 flex flex-col items-center justify-center text-center p-2 ${
                      isMatched ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
                    }`}
                    onClick={() => !isMatched && handleItemClick(item)}
                    disabled={isMatched}
                  >
                    {gameType === 'elements' && (
                      <>
                        <div className="text-2xl mb-1">
                          {item.type === 'symbol' ? item.symbol : item.name}
                        </div>
                        <div className="text-xs opacity-70">
                          {item.type === 'symbol' ? t.symbol : t.name}
                        </div>
                      </>
                    )}
                    
                    {gameType === 'bodyParts' && (
                      <>
                        <div className="text-sm mb-1">
                          {item.type === 'organ' ? item.organ : item.function}
                        </div>
                      </>
                    )}
                    
                    {gameType === 'planets' && (
                      <>
                        <div className="text-sm mb-1">
                          {item.type === 'planet' ? item.planet : item.fact}
                        </div>
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-6">
              <Progress value={(Object.keys(matches).length / currentItems.length) * 100} />
              <p className="text-center text-sm text-gray-600 mt-2">
                {Object.keys(matches).length} / {currentItems.length} matches completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}