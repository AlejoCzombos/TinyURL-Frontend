import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

interface LinkFormProps {
  onCreateLink: (original: string, alias: string) => void;
}

export function LinkForm({ onCreateLink }: LinkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newAlias, setNewAlias] = useState("");

  const handleCreateLink = () => {
    if (newUrl) {
      onCreateLink(newUrl, newAlias);
      setNewUrl("");
      setNewAlias("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4">
          <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo link corto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Pega tu URL aquí"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <Input disabled value="https://tinyurl.alejoczombos.com.ar/" />
            <Input
              placeholder="Alias (opcional)"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateLink}>Crear Link Corto</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
