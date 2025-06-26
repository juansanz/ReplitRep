import { useState } from "react";
import QuizContainer from "@/components/quiz-container";
import ProfileContainer from "@/components/profile-container";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = (completedSessionId: string) => {
    setSessionId(completedSessionId);
    setQuizCompleted(true);
  };

  const handleGoBack = () => {
    setSessionId("");
    setQuizCompleted(false);
  };

  if (quizCompleted && sessionId) {
    return <ProfileContainer sessionId={sessionId} onGoBack={handleGoBack} />;
  }

  return <QuizContainer onQuizComplete={handleQuizComplete} />;
}
