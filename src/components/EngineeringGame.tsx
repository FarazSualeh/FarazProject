import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Trophy, Wrench, Settings, Construction } from "lucide-react";

interface EngineeringGameProps {
  language: string;
  onBack: () => void;
}

const translations = {
  en: {
    title: "Engineering Challenge",
    score: "Score",
    level: "Level",
    bridgeBuilder: "Bridge Builder",
    machineDesign: "Machine Design",
    robotAssembly: "Robot Assembly",
    gameOver: "Game Over!",
    finalScore: "Final Score",
    playAgain: "Play Again",
    backToDashboard: "Back to Dashboard",
    correct: "Correct!",
    wrong: "Wrong!",
    instructions: "Design and build engineering solutions!",
    pointsEarned: "points earned!",
    wellDone: "Well Done!",
    newLevel: "New Level Unlocked!",
    nextLevel: "Next Level",
    material: "Material",
    strength: "Strength",
    cost: "Cost",
    weight: "Weight",
    buildBridge: "Build Bridge",
    testBridge: "Test Bridge",
    engineeringMaster: "Engineering Master!",
    selectMaterials: "Select Materials",
    designPhase: "Design Phase",
    testingPhase: "Testing Phase"
  },
  hi: {
    title: "इंजीनियरिंग चुनौती",
    score: "स्कोर",
    level: "स्तर",
    bridgeBuilder: "पुल निर्माता",
    machineDesign: "मशीन डिजाइन",
    robotAssembly: "रोबोट असेंबली",
    gameOver: "खेल समाप्त!",
    finalScore: "अंतिम स्कोर",
    playAgain: "फिर खेलें",
    backToDashboard: "डैशबोर्ड पर वापस",
    correct: "सही!",
    wrong: "गलत!",
    instructions: "इंजीनियरिंग समाधान डिजाइन और निर्माण करें!",
    pointsEarned: "अंक अर्जित!",
    wellDone: "बहुत अच्छा!",
    newLevel: "नया स्तर खुला!",
    nextLevel: "अगला स्तर",
    material: "सामग्री",
    strength: "मजबूती",
    cost: "लागत",
    weight: "वजन",
    buildBridge: "पुल बनाएं",
    testBridge: "पुल का परीक्षण करें",
    engineeringMaster: "इंजीनियरिंग मास्टर!",
    selectMaterials: "सामग्री चुनें",
    designPhase: "डिजाइन चरण",
    testingPhase: "परीक्षण चरण"
  },
  od: {
    title: "ଇଞ୍ଜିନିୟରିଂ ଚ୍ୟାଲେଞ୍ଜ",
    score: "ସ୍କୋର",
    level: "ସ୍ତର",
    bridgeBuilder: "ବ୍ରିଜ୍ ନିର୍ମାତା",
    machineDesign: "ମେସିନ୍ ଡିଜାଇନ୍",
    robotAssembly: "ରୋବଟ୍ ଆସେମ୍ବଲୀ",
    gameOver: "ଖେଳ ସମାପ୍ତ!",
    finalScore: "ଅନ୍ତିମ ସ୍କୋର",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    correct: "ସଠିକ୍!",
    wrong: "ଭୁଲ!",
    instructions: "ଇଞ୍ଜିନିୟରିଂ ସମାଧାନ ଡିଜାଇନ୍ ଏବଂ ନିର୍ମାଣ କରନ୍ତୁ!",
    pointsEarned: "ପଏଣ୍ଟ ଅର୍ଜନ!",
    wellDone: "ବହୁତ ଭଲ!",
    newLevel: "ନୂତନ ସ୍ତର ଖୋଲିଗଲା!",
    nextLevel: "ପରବର୍ତ୍ତୀ ସ୍ତର",
    material: "ସାମଗ୍ରୀ",
    strength: "ଶକ୍ତି",
    cost: "ମୂଲ୍ୟ",
    weight: "ଓଜନ",
    buildBridge: "ବ୍ରିଜ୍ ନିର୍ମାଣ କରନ୍ତୁ",
    testBridge: "ବ୍ରିଜ୍ ପରୀକ୍ଷା କରନ୍ତୁ",
    engineeringMaster: "ଇଞ୍ଜିନିୟରିଂ ମାଷ୍ଟର!",
    selectMaterials: "ସାମଗ୍ରୀ ବାଛନ୍ତୁ",
    designPhase: "ଡିଜାଇନ୍ ପର୍ଯ୍ୟାୟ",
    testingPhase: "ପରୀକ୍ଷଣ ପର୍ଯ୍ୟାୟ"
  }
};

const materials = [
  { name: "Wood", strength: 3, cost: 2, weight: 2, color: "#8B4513", icon: "🪵" },
  { name: "Steel", strength: 5, cost: 4, weight: 5, color: "#708090", icon: "🔩" },
  { name: "Concrete", strength: 4, cost: 3, weight: 4, color: "#A0A0A0", icon: "🧱" },
  { name: "Cable", strength: 4, cost: 5, weight: 1, color: "#2F4F4F", icon: "🔗" },
  { name: "Bamboo", strength: 2, cost: 1, weight: 1, color: "#9ACD32", icon: "🎋" },
  { name: "Carbon Fiber", strength: 5, cost: 6, weight: 1, color: "#36454F", icon: "⚫" }
];

const challenges = [
  { 
    name: "Small Creek Bridge", 
    distance: 10, 
    weight: 50, 
    budget: 100,
    description: "Build a bridge to cross a small creek"
  },
  { 
    name: "River Bridge", 
    distance: 25, 
    weight: 100, 
    budget: 200,
    description: "Build a stronger bridge for heavier traffic"
  },
  { 
    name: "Canyon Bridge", 
    distance: 50, 
    weight: 200, 
    budget: 300,
    description: "Build a massive bridge across a deep canyon"
  }
];

export function EngineeringGame({ language, onBack }: EngineeringGameProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gamePhase, setGamePhase] = useState<'design' | 'testing' | 'complete'>('design');
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [totalStrength, setTotalStrength] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);

  // Ensure language is valid, default to 'en'
  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;

  const calculateTotals = () => {
    const strength = selectedMaterials.reduce((sum, mat) => sum + mat.strength * mat.quantity, 0);
    const cost = selectedMaterials.reduce((sum, mat) => sum + mat.cost * mat.quantity, 0);
    const weight = selectedMaterials.reduce((sum, mat) => sum + mat.weight * mat.quantity, 0);
    
    setTotalStrength(strength);
    setTotalCost(cost);
    setTotalWeight(weight);
  };

  const addMaterial = (material: any) => {
    const existing = selectedMaterials.find(m => m.name === material.name);
    if (existing) {
      setSelectedMaterials(prev => 
        prev.map(m => 
          m.name === material.name 
            ? { ...m, quantity: m.quantity + 1 }
            : m
        )
      );
    } else {
      setSelectedMaterials(prev => [...prev, { ...material, quantity: 1 }]);
    }
  };

  const removeMaterial = (materialName: string) => {
    setSelectedMaterials(prev => {
      const updated = prev.map(m => 
        m.name === materialName 
          ? { ...m, quantity: Math.max(0, m.quantity - 1) }
          : m
      ).filter(m => m.quantity > 0);
      return updated;
    });
  };

  const testBridge = () => {
    const strengthNeeded = currentChallenge.distance * 2 + currentChallenge.weight / 10;
    const isSuccessful = totalStrength >= strengthNeeded && totalCost <= currentChallenge.budget;
    
    if (isSuccessful) {
      const efficiency = Math.round((currentChallenge.budget - totalCost) / currentChallenge.budget * 100);
      const points = level * 50 + efficiency;
      setScore(score + points);
      setFeedback(`${t.correct} Efficiency: ${efficiency}% +${points} ${t.pointsEarned}`);
      
      setTimeout(() => {
        if (level < 3) {
          setLevel(level + 1);
          setCurrentChallenge(challenges[level]);
          resetBridge();
          setFeedback(t.newLevel);
          setTimeout(() => setShowFeedback(false), 2000);
        } else {
          setGameComplete(true);
        }
      }, 2000);
    } else {
      if (totalStrength < strengthNeeded) {
        setFeedback(`${t.wrong} Bridge too weak! Need ${Math.ceil(strengthNeeded)} strength.`);
      } else {
        setFeedback(`${t.wrong} Over budget! Cost: ${totalCost}, Budget: ${currentChallenge.budget}`);
      }
      setTimeout(() => setShowFeedback(false), 3000);
    }
    
    setShowFeedback(true);
    setGamePhase('testing');
  };

  const resetBridge = () => {
    setSelectedMaterials([]);
    setGamePhase('design');
    setFeedback('');
    setShowFeedback(false);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentChallenge(challenges[0]);
    setGameComplete(false);
    resetBridge();
  };

  useEffect(() => {
    calculateTotals();
  }, [selectedMaterials]);

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">{t.gameOver}</CardTitle>
            <CardDescription>{t.wellDone}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl">{score}</div>
            <p className="text-sm text-gray-600">{t.finalScore}</p>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Construction className="mx-auto w-8 h-8 text-orange-500 mb-2" />
              <p className="text-orange-700">{t.engineeringMaster}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
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
            <Wrench className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl">{currentChallenge.name}</h2>
          </div>
        </div>

        {/* Challenge Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentChallenge.description}</CardTitle>
            <CardDescription>
              Distance: {currentChallenge.distance}m | Max Weight: {currentChallenge.weight}kg | Budget: ${currentChallenge.budget}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t.selectMaterials}</CardTitle>
              <CardDescription>{t.instructions}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 mb-6">
                {materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{material.icon}</span>
                      <div>
                        <div className="text-sm">{material.name}</div>
                        <div className="text-xs text-gray-500">
                          Strength: {material.strength} | Cost: ${material.cost} | Weight: {material.weight}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeMaterial(material.name)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">
                        {selectedMaterials.find(m => m.name === material.name)?.quantity || 0}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addMaterial(material)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bridge Design & Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{gamePhase === 'design' ? t.designPhase : t.testingPhase}</CardTitle>
              <CardDescription>
                {gamePhase === 'design' ? "Design your bridge" : "Testing your bridge design"}
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

              {/* Bridge Visualization */}
              <div className="mb-6 h-32 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg relative overflow-hidden">
                {/* Simple bridge representation */}
                <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-600 rounded"></div>
                <div className="absolute bottom-6 left-1/4 w-1 h-8 bg-gray-700"></div>
                <div className="absolute bottom-6 right-1/4 w-1 h-8 bg-gray-700"></div>
                
                {/* Material indicators */}
                {selectedMaterials.map((material, index) => (
                  <div
                    key={index}
                    className="absolute bottom-2 text-xs p-1 rounded"
                    style={{
                      left: `${20 + index * 15}%`,
                      backgroundColor: material.color,
                      color: 'white'
                    }}
                  >
                    {material.quantity}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span>Total Strength:</span>
                  <Badge variant={totalStrength >= (currentChallenge.distance * 2 + currentChallenge.weight / 10) ? "default" : "destructive"}>
                    {totalStrength}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Cost:</span>
                  <Badge variant={totalCost <= currentChallenge.budget ? "default" : "destructive"}>
                    ${totalCost}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Weight:</span>
                  <Badge variant="secondary">{totalWeight}</Badge>
                </div>
              </div>

              <Progress value={(totalCost / currentChallenge.budget) * 100} className="mb-4" />
              <p className="text-center text-sm text-gray-600 mb-4">
                Budget Used: ${totalCost} / ${currentChallenge.budget}
              </p>

              {gamePhase === 'design' && (
                <Button 
                  onClick={testBridge}
                  disabled={selectedMaterials.length === 0 || showFeedback}
                  className="w-full"
                  size="lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t.testBridge}
                </Button>
              )}

              {gamePhase === 'testing' && !showFeedback && (
                <Button 
                  onClick={resetBridge}
                  variant="outline"
                  className="w-full" 
                  size="lg"
                >
                  {t.designPhase}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}