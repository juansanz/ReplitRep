import { useState } from "react";
import QuizContainer from "@/components/quiz-container";
import ProfileContainer from "@/components/profile-container";
import IncompatibleContainer from "@/components/incompatible-container";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isIncompatible, setIsIncompatible] = useState(false);

  const handleQuizComplete = (completedSessionId: string) => {
    setSessionId(completedSessionId);
    setQuizCompleted(true);
  };

  const handleIncompatible = () => {
    setIsIncompatible(true);
  };

  const handleTryAgain = () => {
    setSessionId("");
    setQuizCompleted(false);
    setIsIncompatible(false);
  };

  const handleGoBack = () => {
    setSessionId("");
    setQuizCompleted(false);
    setIsIncompatible(false);
  };

  if (isIncompatible) {
    return <IncompatibleContainer onTryAgain={handleTryAgain} />;
  }

  if (quizCompleted && sessionId) {
    return <ProfileContainer sessionId={sessionId} onGoBack={handleGoBack} />;
  }

  return <QuizContainer onQuizComplete={handleQuizComplete} onIncompatible={handleIncompatible} />;
}
