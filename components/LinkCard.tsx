import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon, BarChartIcon, MoreVerticalIcon, CalendarIcon } from "lucide-react";

interface LinkCardProps {
  link: {
    original: string;
    shortened: string;
    title: string;
    image: string;
    clicks: number;
    createdAt: Date;
  };
  onCopy: (text: string) => void;
}

export function LinkCard({ link, onCopy }: LinkCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row p-4">
        <div className="flex-grow pr-4">
          <h2 className="text-xl font-semibold">{link.title}</h2>
          <p className="text-muted-foreground text-sm truncate">{link.original}</p>
          <a href={link.shortened} className="text-primary hover:underline">
            {link.shortened}
          </a>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Creado el {formatDate(link.createdAt)}</span>
          </div>
          <div className="mt-2 space-x-2">
            <Button variant="outline" size="sm" onClick={() => onCopy(link.shortened)}>
              <CopyIcon className="h-4 w-4 mr-2" /> Copiar
            </Button>
            <Button variant="outline" size="sm">
              <BarChartIcon className="h-4 w-4 mr-2" /> {link.clicks} clicks
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <img
          src={link.image}
          alt={link.title}
          className="w-24 h-24 object-cover rounded mt-4 sm:mt-0"
        />
      </CardContent>
    </Card>
  );
}
