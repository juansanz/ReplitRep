import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Unlock, ArrowLeft, ShieldCheck, MapPin, Briefcase, Images, Heart, Phone, Mail, MessageSquare, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProfileContainerProps {
  sessionId: string;
  onGoBack: () => void;
}

export default function ProfileContainer({ sessionId, onGoBack }: ProfileContainerProps) {
  const [showProfile, setShowProfile] = useState(false);

  const trackProfileViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/profile/view", { sessionId }),
    onSuccess: () => {
      setShowProfile(true);
    }
  });

  const handleGoBack = () => {
    const confirmed = window.confirm('¿Seguro que quieres volver? Tendrás que completar el desafío de nuevo.');
    if (confirmed) {
      onGoBack();
    }
  };

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-xl font-semibold text-neutral">Mi Perfil</h1>
            <div className="flex items-center space-x-2 text-sm text-success">
              <ShieldCheck className="w-4 h-4" />
              <span>Verificado</span>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="p-4 pb-20">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Main Photo Section */}
            <Card className="shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
                alt="Foto de Juan" 
                className="w-full h-96 object-cover"
              />
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral mb-2">Juan</h2>
                  <p className="text-gray-600">Madrid, España</p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.open('https://wa.me/34644496175', '_blank')}
                  >
                    <MessageSquare className="mr-2 w-5 h-5" />
                    Chatear por WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.open('tel:+34644496175', '_self')}
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Llamar ahora
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-center text-gray-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    Gracias por completar el desafío. ¡Espero conocerte pronto!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-success rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <Check className="text-white text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-neutral mb-4">¡Fantástico! 🎉</h2>
        <p className="text-gray-600 mb-8">Has completado el desafío con éxito. Ahora puedes acceder a mi perfil completo.</p>
        <Button 
          className="w-full bg-gradient-to-r from-success to-secondary text-white font-semibold py-4 px-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => trackProfileViewMutation.mutate()}
          disabled={trackProfileViewMutation.isPending}
        >
          <Unlock className="mr-2 w-4 h-4" />
          Ver Perfil Completo
        </Button>
      </div>
    </div>
  );
}
