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
import { format, isBefore, startOfMinute } from "date-fns";
import { Calendar } from "./ui/calendar";
import { parseBackendDate } from "@/lib/dateUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UrlFormProps {
  handleCreateOrUpdateUrl: (
    id: string | null,
    longUrl: string,
    alias: string,
    expiresAt: Date | null
  ) => Promise<void>;
  editUrl?: URLResponse | null;
  handleSetEditUrlNull: () => void;
}

function TimeSelect({
  value,
  onChange,
  minDate,
}: {
  value: Date;
  onChange: (date: Date) => void;
  minDate: Date;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const isDisabled = (hour: number, minute: number) => {
    const selectedDate = new Date(value);
    selectedDate.setHours(hour, minute, 0, 0);
    return isBefore(selectedDate, minDate);
  };

  return (
    <div className="flex space-x-2">
      <Select
        value={value.getHours().toString().padStart(2, "0")}
        onValueChange={(newHour) => {
          const newDate = new Date(value);
          newDate.setHours(parseInt(newHour));
          if (!isDisabled(parseInt(newHour), newDate.getMinutes())) {
            onChange(newDate);
          }
        }}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem
              key={hour}
              value={hour}
              disabled={isDisabled(parseInt(hour), value.getMinutes())}
            >
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-2xl">:</span>
      <Select
        value={value.getMinutes().toString().padStart(2, "0")}
        onValueChange={(newMinute) => {
          const newDate = new Date(value);
          newDate.setMinutes(parseInt(newMinute));
          if (!isDisabled(newDate.getHours(), parseInt(newMinute))) {
            onChange(newDate);
          }
        }}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem
              key={minute}
              value={minute}
              disabled={isDisabled(value.getHours(), parseInt(minute))}
            >
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function UrlForm({ handleCreateOrUpdateUrl, editUrl, handleSetEditUrlNull }: UrlFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editUrl) {
      setUrl(editUrl.url);
      setAlias(editUrl.alias);
      setExpiresAt(editUrl.expiresAt ? parseBackendDate(editUrl.expiresAt) : null);
      setIsOpen(true);
    }
  }, [editUrl]);

  const handleSubmit = async () => {
    if (!validateUrl(url)) {
      toast({
        title: "URL inválida",
        description: "Por favor, ingrese una URL válida.",
        variant: "destructive",
      });
      return;
    }

    if (expiresAt && isBefore(expiresAt, new Date())) {
      toast({
        title: "Fecha de expiración inválida",
        description: "La fecha de expiración debe ser posterior a la fecha actual.",
        variant: "destructive",
      });
      return;
    }

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
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setUrl("");
    setAlias("");
    setExpiresAt(null);
    handleSetEditUrlNull();
  };

  const minDate = startOfMinute(new Date());

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-8">
          {editUrl ? <Pencil className="mr-2 h-4 w-4" /> : <PlusIcon className="mr-2 h-4 w-4" />}
          {editUrl ? "Editar Link" : "Nuevo Link"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editUrl ? "Editar link" : "Crear nuevo link corto"}</DialogTitle>
          <DialogDescription>
            {editUrl ? "Editar link" : "Crear nuevo link corto"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="https://"
            value={url}
            disabled={editUrl !== null}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <Input disabled value="tinyurl.alejoczombos.com.ar/" />
            <Input
              placeholder="Alias (opcional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expiresAt && "text-muted-foreground"
                )}
              >
                {expiresAt ? (
                  format(expiresAt, "PPP HH:mm")
                ) : (
                  <span>Fecha y hora de expiración (opcional)</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiresAt || undefined}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setHours(expiresAt?.getHours() || minDate.getHours());
                    newDate.setMinutes(expiresAt?.getMinutes() || minDate.getMinutes());
                    if (isBefore(newDate, minDate)) {
                      newDate.setHours(minDate.getHours(), minDate.getMinutes());
                    }
                    setExpiresAt(newDate);
                  } else {
                    setExpiresAt(null);
                  }
                }}
                disabled={(date) => isBefore(date, minDate)}
                initialFocus
              />
              {expiresAt && (
                <div className="p-3 border-t border-border">
                  <TimeSelect value={expiresAt} onChange={setExpiresAt} minDate={minDate} />
                </div>
              )}
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
