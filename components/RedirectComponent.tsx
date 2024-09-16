// components/RedirectComponent.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getURLByKeyOrAlias } from "@/api/URL.api";

async function getRedirectUrl(alias: string): Promise<string> {
  const response = await getURLByKeyOrAlias(alias);
  if (!response.ok) {
    throw new Error("Failed to fetch URL");
  }
  const data = await response.json();
  return data.url;
}

export function RedirectComponent({ alias }: { alias: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      try {
        toast({
          title: "Redirigiendo...",
          description: "Por favor, espere mientras le redirigimos a su destino.",
          duration: 5000,
        });

        const url = await getRedirectUrl(alias);
        setIsLoading(false);
        window.location.href = url;
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No se pudo redirigir. Por favor, intente de nuevo.",
          variant: "destructive",
        });
        console.error("Error redirecting:", error);
      }
    };

    redirect();
  }, [alias, router, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium">Redirigiendo a su destino...</p>
      </div>
    );
  }

  return null;
}
