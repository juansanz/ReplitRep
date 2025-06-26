import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, XCircle, RotateCcw } from "lucide-react";

interface IncompatibleContainerProps {
  onTryAgain: () => void;
}

export default function IncompatibleContainer({ onTryAgain }: IncompatibleContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-destructive/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <XCircle className="text-destructive text-4xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral mb-4">Lo siento...</h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Parece que no somos compatibles. Cada persona tiene sus preferencias 
              y eso está bien.
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Te deseo lo mejor en tu búsqueda. ¡Que tengas un buen día!
            </p>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Puedes cerrar esta página
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}