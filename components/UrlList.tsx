import { URLResponse } from "@/types/URL";
import { UrlCard } from "./UrlCard";
import { format } from "date-fns";

interface UrlListProps {
  urls: URLResponse[];
  onCopy: (text: string) => void;
  onDelete: (key: string) => void;
  onEdit: (link: URLResponse) => void;
}

export function UrlList({ urls, onCopy, onDelete, onEdit }: UrlListProps) {
  if (urls.length === 0) {
    return (
      <div className="text-center">
        <img
          src="/placeholder.svg?height=200&width=200"
          alt="No links yet"
          className="mx-auto mb-4"
        />
        <p className="text-muted-foreground">No hay links creados aún. ¡Crea uno nuevo!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {urls.map((url) => (
        <UrlCard key={url.key} url={url} onCopy={onCopy} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
