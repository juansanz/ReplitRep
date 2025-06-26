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
                alt="Foto principal de Juan" 
                className="w-full h-96 object-cover"
              />
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral">Juan</h2>
                    <p className="text-gray-600">28 años</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-primary mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">Madrid, España</span>
                    </div>
                    <div className="flex items-center text-secondary">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span className="text-sm">Ingeniero de Software</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Apasionado por la tecnología, los viajes y las buenas conversaciones. 
                  Me encanta cocinar, hacer senderismo los fines de semana y descubrir nuevos lugares. 
                  Busco a alguien especial para compartir aventuras y crear recuerdos inolvidables.
                </p>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral mb-4 flex items-center">
                  <Images className="w-5 h-5 mr-2 text-primary" />
                  Más fotos
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Juan haciendo senderismo" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  
                  <img 
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Juan cocinando" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Juan leyendo en un café" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Juan viajando" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interests Section */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-primary" />
                  Mis intereses
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">🏔️ Senderismo</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">👨‍🍳 Cocina</span>
                  <span className="bg-accent/20 text-neutral px-3 py-1 rounded-full text-sm font-medium">✈️ Viajes</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">📚 Lectura</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">💻 Tecnología</span>
                  <span className="bg-accent/20 text-neutral px-3 py-1 rounded-full text-sm font-medium">🎬 Cine</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">🏃‍♂️ Running</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">🎵 Música</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Información de contacto
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/20 rounded-xl p-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3" />
                      <span>Teléfono</span>
                    </div>
                    <a href="tel:+34612345678" className="font-semibold hover:underline">+34 612 345 678</a>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/20 rounded-xl p-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3" />
                      <span>Email</span>
                    </div>
                    <a href="mailto:juan@ejemplo.com" className="font-semibold hover:underline">juan@ejemplo.com</a>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/20 rounded-xl p-3">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span>WhatsApp</span>
                    </div>
                    <a href="https://wa.me/34612345678" className="font-semibold hover:underline">+34 612 345 678</a>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white/20 rounded-xl">
                  <p className="text-sm text-center">
                    <Info className="w-4 h-4 inline mr-1" />
                    Gracias por completar el desafío. ¡Espero conocerte pronto! 😊
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
