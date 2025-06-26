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
    question: "¿Cuál es tu plan perfecto para un viernes por la noche?",
    icon: Gamepad,
    iconColor: "bg-accent",
    options: [
      { letter: "A", text: "Una cena íntima seguida de un paseo bajo las estrellas", isCorrect: true },
      { letter: "B", text: "Fiesta hasta el amanecer en el club más concurrido", isCorrect: false },
      { letter: "C", text: "Maratón de Netflix en pijama", isCorrect: false },
    ]
  },
  {
    id: 2,
    title: "Pregunta 2 de 3",
    question: "Si pudieras viajar a cualquier lugar del mundo, ¿cuál sería?",
    icon: Plane,
    iconColor: "bg-secondary",
    options: [
      { letter: "A", text: "Santorini, Grecia - por las puestas de sol románticas", isCorrect: true },
      { letter: "B", text: "Tokio, Japón - por la tecnología y la cultura", isCorrect: false },
      { letter: "C", text: "Nueva York - por la energía de la gran ciudad", isCorrect: false },
    ]
  },
  {
    id: 3,
    title: "Pregunta 3 de 3",
    question: "¿Qué buscas en una relación?",
    icon: Heart,
    iconColor: "bg-accent",
    options: [
      { letter: "A", text: "Una conexión profunda y significativa", isCorrect: true },
      { letter: "B", text: "Diversión sin compromisos", isCorrect: false },
      { letter: "C", text: "Alguien que comparta mis hobbies", isCorrect: false },
    ]
  }
];

export default function QuizContainer({ onQuizComplete }: QuizContainerProps) {
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
      setSessionId(data.sessionId);
      setShowQuestions(true);
      setCurrentQuestion(1);
    },
    onError: () => {
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
      if (data.correct) {
        setShowError(false);
        if (data.completed) {
          onQuizComplete(sessionId);
        } else {
          setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer("");
          }, 500);
        }
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    },
    onError: () => {
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
                      className={`w-full text-left p-4 h-auto justify-start hover:border-primary hover:bg-red-50 transition-all duration-200 ${
                        selectedAnswer === option.letter && !option.isCorrect ? 'border-destructive bg-destructive/10' : ''
                      }`}
                      onClick={() => handleAnswer(option.letter)}
                      disabled={answerMutation.isPending}
                    >
                      <div className="flex items-center w-full">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                          option.isCorrect ? 'bg-primary text-white' : 'bg-gray-400 text-white'
                        }`}>
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
              Me llamo Juan y me encantaría conocerte mejor. Antes de acceder a mi perfil completo, 
              me gustaría saber un poco sobre ti con unas preguntas divertidas.
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
