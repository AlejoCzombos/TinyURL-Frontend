"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getURLByKeyOrAlias } from "@/api/URL.api";

async function getRedirectUrl(alias: string): Promise<string> {
  const response = await getURLByKeyOrAlias(alias);
  console.log("Status: ", response.status);
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("LINK_EXPIRED");
    } else if (response.status === 404) {
      throw new Error("LINK_NOT_FOUND");
    }
    throw new Error("REDIRECT_FAILED");
  }
  const data = await response.json();
  return data.url;
}

export function RedirectComponent({ keyOrAlias }: { keyOrAlias: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const redirect = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = await getRedirectUrl(keyOrAlias);

        if (isMounted) {
          router.replace(url);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
          if (error instanceof Error) {
            switch (error.message) {
              case "LINK_EXPIRED":
                setError("El enlace ha expirado y ha sido eliminado.");
                break;
              case "LINK_NOT_FOUND":
                setError("El enlace no existe o ha sido eliminado.");
                break;
              default:
                setError("No se pudo redirigir. Por favor, intente de nuevo.");
            }
          } else {
            setError("Ocurrió un error inesperado.");
          }
          console.error("Error redirecting:", error);
        }
      }
    };

    redirect();

    return () => {
      isMounted = false;
    };
  }, [keyOrAlias, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error de redirección",
        description: error,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium">Redirigiendo a su destino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
