import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusIcon, Pencil } from "lucide-react";
import { URLResponse } from "@/types/URL";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { parseBackendDate } from "@/lib/dateUtils";

interface UrlFormProps {
  handleCreateOrUpdateUrl: (
    id: string | null,
    longUrl: string,
    alias: string,
    expiresAt: Date | null
  ) => Promise<void>;
  editUrl?: URLResponse | null;
}

export function UrlForm({ handleCreateOrUpdateUrl, editUrl }: UrlFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editUrl) {
      setUrl(editUrl.url);
      setAlias(editUrl.alias);
      setExpiresAt(editUrl.expiresAt ? parseBackendDate(editUrl.expiresAt) : null);
      setIsOpen(true);
    }
  }, [editUrl]);

  const handleSubmit = async () => {
    if (url) {
      setIsLoading(true);
      try {
        await handleCreateOrUpdateUrl(editUrl?.key || null, url, alias, expiresAt);
        setUrl("");
        setAlias("");
        setExpiresAt(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Error creating/updating link:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-8">
          {editUrl ? <Pencil className="mr-2 h-4 w-4" /> : <PlusIcon className="mr-2 h-4 w-4" />}
          {editUrl ? "Editar Link" : "Nuevo Link"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editUrl ? "Editar link" : "Crear nuevo link corto"}</DialogTitle>
          <DialogDescription>
            {editUrl ? "Editar link" : "Crear nuevo link corto"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Pega tu URL aquí"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            placeholder="Alias (opcional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expiresAt && "text-muted-foreground"
                )}
              >
                {expiresAt ? format(expiresAt, "PPP") : <span>Fecha de expiración (opcional)</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiresAt}
                onSelect={setExpiresAt}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Procesando..." : editUrl ? "Actualizar Link" : "Crear Link Corto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
