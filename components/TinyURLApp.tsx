"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { UrlForm } from "./UrlForm";
import { UrlList } from "./UrlList";
import { URLCreate, URLResponse } from "@/types/URL";
import { createURL, deleteURL, getURLs, updateURL } from "@/api/URL.api";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { parseBackendDate } from "@/lib/dateUtils";

export function TinyURLApp() {
  const [urls, setUrls] = useState<URLResponse[]>([]);
  const [editUrl, setEditUrl] = useState<URLResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setIsLoading(true);
      const response = await getURLs();
      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError("Error al cargar los enlaces");
      toast({
        title: "Error",
        description: "No se pudieron cargar los enlaces. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateUrl = async (
    key: string | null,
    url: string,
    alias: string,
    expiresAt: Date | null
  ) => {
    try {
      const urlData: URLCreate = {
        url,
        alias: alias || undefined,
        expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
      };

      let updatedUrl: URLResponse;
      if (key) {
        const urlDataUpdate: Partial<URLCreate> = {};
        const originalUrl = urls.find((url) => url.key === key);

        if (originalUrl?.alias !== alias) {
          urlDataUpdate.alias = alias;
        }
        if (originalUrl?.url !== url) {
          urlDataUpdate.url = url;
        }

        if (originalUrl?.expiresAt) {
          const originalExpiresAt = parseBackendDate(originalUrl?.expiresAt);
          if (originalExpiresAt.toISOString() !== expiresAt?.toISOString()) {
            urlDataUpdate.expiresAt = expiresAt?.toISOString();
          }
        }

        if (
          urlDataUpdate.url === undefined &&
          urlDataUpdate.alias === undefined &&
          urlDataUpdate.expiresAt === undefined
        ) {
          setEditUrl(null);
          return;
        }

        updatedUrl = await updateURL(key, urlDataUpdate);

        console.log("updatedUrl", updatedUrl);
        setUrls(urls.map((url) => (url.key === key ? updatedUrl : url)));
      } else {
        updatedUrl = await createURL(urlData);
        setUrls([updatedUrl, ...urls]);
      }
      setEditUrl(null);
      toast({
        title: key ? "Link actualizado" : "Link creado",
        description: key
          ? "El link ha sido actualizado exitosamente."
          : "El link corto ha sido creado exitosamente.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `No se pudo ${
          key ? "actualizar" : "crear"
        } el link corto. Por favor, intenta de nuevo.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUrl = async (key: string) => {
    try {
      await deleteURL(key);
      setUrls(urls.filter((url) => url.key !== key));
      toast({
        title: "Link eliminado",
        description: "El link ha sido eliminado exitosamente.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el link. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleEditUrl = (url: URLResponse) => {
    setEditUrl(url);
  };

  const handleSetEditUrlNull = () => {
    setEditUrl(null);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "El link ha sido copiado al portapapeles.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <UrlForm
          handleCreateOrUpdateUrl={handleCreateOrUpdateUrl}
          editUrl={editUrl}
          handleSetEditUrlNull={handleSetEditUrlNull}
        />
        {isLoading ? (
          <p className="text-center">Cargando enlaces...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <UrlList
            urls={urls}
            onCopy={handleCopyToClipboard}
            onDelete={handleDeleteUrl}
            onEdit={handleEditUrl}
          />
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
