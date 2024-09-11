import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyIcon,
  BarChartIcon,
  MoreVerticalIcon,
  CalendarIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";
import { URLResponse } from "@/types/URL";
import { format } from "date-fns";

interface UrlCardProps {
  url: URLResponse;
  onCopy: (text: string) => void;
  onDelete: (key: string) => void;
  onEdit: (url: URLResponse) => void;
}

export function UrlCard({ url, onCopy, onDelete, onEdit }: UrlCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48">
          <img
            src={`https://picsum.photos/seed/${url.key}/400/200`}
            alt={url.alias || "url image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-4">
            <h2 className="text-white text-xl font-semibold truncate mb-2">
              {url.alias || "Sin título"}
            </h2>
            <p className="text-white text-sm truncate">{url.url}</p>
          </div>
        </div>
        <div className="p-4">
          <a href={url.url} className="text-primary hover:underline block mb-2">
            {url.url}
          </a>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Creado el {formatDate(url.createdAt)}</span>
          </div>
          {url.expiresAt && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Expira el {formatDate(url.expiresAt)}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onCopy(url.url)}>
              <CopyIcon className="h-4 w-4 mr-2" /> Copiar
            </Button>
            <Button variant="outline" size="sm">
              <BarChartIcon className="h-4 w-4 mr-2" /> {url.hit} clicks
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(url)}>
                  <PencilIcon className="h-4 w-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(url.key)}>
                  <TrashIcon className="h-4 w-4 mr-2" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
