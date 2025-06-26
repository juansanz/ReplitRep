import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Play, Gamepad, Plane, TriangleAlert, Shield } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuizContainerProps {
  onQuizComplete: (sessionId: string) => void;
  onIncompatible: () => void;
}

interface QuizOption {
  letter: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  title: string;
  question: string;
  icon: any;
  iconColor: string;
  options: QuizOption[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Pregunta 1 de 3",
    question: "¿Cuál es la respuesta a todo?",
    icon: Gamepad,
    iconColor: "bg-accent",
    options: [
      { letter: "A", text: "42", isCorrect: true },
      { letter: "B", text: "Jesucristo", isCorrect: false },
      { letter: "C", text: "Y yo que sé", isCorrect: false },
    ]
  },
  {
    id: 2,
    title: "Pregunta 2 de 3",
    question: "¿Tortilla de patatas con o sin cebolla?",
    icon: Heart,
    iconColor: "bg-secondary",
    options: [
      { letter: "A", text: "Con cebolla", isCorrect: false },
      { letter: "B", text: "Sin cebolla", isCorrect: true },
      { letter: "C", text: "Me da igual", isCorrect: true },
    ]
  },
  {
    id: 3,
    title: "Pregunta 3 de 3",
    question: "¿Eres fumadora?",
    icon: Shield,
    iconColor: "bg-accent",
    options: [
      { letter: "A", text: "De vez en cuando", isCorrect: false },
      { letter: "B", text: "Sí", isCorrect: false },
      { letter: "C", text: "Nunca", isCorrect: true },
    ]
  }
];

export default function QuizContainer({ onQuizComplete, onIncompatible }: QuizContainerProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const { toast } = useToast();

  const startQuizMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/quiz/start"),
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.blocked) {
        onIncompatible();
        return;
      }
      setSessionId(data.sessionId);
      setShowQuestions(true);
      setCurrentQuestion(1);
    },
    onError: async (error) => {
      // Check if it's a blocked IP error
      if (error instanceof Response && error.status === 403) {
        const data = await error.json();
        if (data.blocked) {
          onIncompatible();
          return;
        }
      }
      toast({
        title: "Error",
        description: "No se pudo iniciar el quiz. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  });

  const answerMutation = useMutation({
    mutationFn: ({ answer, questionNumber }: { answer: string, questionNumber: number }) =>
      apiRequest("POST", "/api/quiz/answer", { sessionId, answer, questionNumber }),
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.blocked) {
        onIncompatible();
        return;
      }
      if (data.correct) {
        setShowError(false);
        if (data.completed) {
          // Immediately show profile for completed quiz
          onQuizComplete(sessionId);
        } else {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer("");
        }
      } else {
        // Wrong answer - trigger incompatibility
        onIncompatible();
      }
    },
    onError: async (error) => {
      // Check if it's a blocked IP error
      if (error instanceof Response && error.status === 403) {
        const data = await error.json();
        if (data.blocked) {
          onIncompatible();
          return;
        }
      }
      toast({
        title: "Error",
        description: "No se pudo procesar la respuesta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  });

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    answerMutation.mutate({ answer, questionNumber: currentQuestion });
  };

  const progressPercentage = (currentQuestion / 3) * 100;

  if (showQuestions && currentQuestion > 0) {
    const question = questions[currentQuestion - 1];
    const IconComponent = question.icon;

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="text-white text-lg" />
              </div>
              <h1 className="text-xl font-semibold text-neutral">Perfil de Juan</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Protegido</span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white px-4 py-2 border-b border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del Desafío</span>
              <span>{currentQuestion}/3</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Quiz Section */}
        <main className="flex-1 p-4 pb-20">
          <div className="max-w-md mx-auto">
            {/* Error Message */}
            {showError && (
              <div className="mb-6">
                <Card className="bg-destructive/10 border-destructive">
                  <CardContent className="p-4 text-center">
                    <TriangleAlert className="text-destructive text-2xl mb-2 mx-auto" />
                    <p className="text-destructive font-medium">¡Oops! Respuesta incorrecta</p>
                    <p className="text-sm text-gray-600 mt-1">Inténtalo de nuevo, estoy seguro de que lo conseguirás 😊</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Question */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${question.iconColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent className="text-neutral text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">{question.title}</h3>
                  <p className="text-gray-600">{question.question}</p>
                </div>
                
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <Button
                      key={option.letter}
                      variant="outline"
                      className="w-full text-left p-4 h-auto justify-start hover:border-primary hover:bg-red-50 transition-all duration-200"
                      onClick={() => handleAnswer(option.letter)}
                      disabled={answerMutation.isPending}
                    >
                      <div className="flex items-center w-full">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 bg-gray-400 text-white">
                          {option.letter}
                        </span>
                        <span className="flex-1">{option.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-semibold text-neutral">Perfil de Juan</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Protegido</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del Desafío</span>
            <span>0/3</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </div>

      {/* Welcome Screen */}
      <main className="flex-1 p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-neutral mb-4">¡Hola! 👋</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Me llamo Juan y me encantaría conocerte mejor. Antes de poder darte mi número, 
              me gustaría que respondieses a unas preguntas como si de una gymkhana se tratase.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Solo tomarán unos segundos y así podremos conocernos mejor 😊
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => startQuizMutation.mutate()}
              disabled={startQuizMutation.isPending}
            >
              <Play className="mr-2 w-4 h-4" />
              Comenzar Desafío
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
