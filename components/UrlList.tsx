import { URLResponse } from "@/types/URL";
import { UrlCard } from "./UrlCard";

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
        <p className="text-muted-foreground">No hay links creados aún. ¡Crea uno nuevo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url, index) => (
        <UrlCard key={index} url={url} onCopy={onCopy} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
