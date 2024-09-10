import { LinkCard } from "./LinkCard";

interface LinkListProps {
  links: Array<{
    original: string;
    shortened: string;
    title: string;
    image: string;
    clicks: number;
    createdAt: Date;
  }>;
  onCopy: (text: string) => void;
}

export function LinkList({ links, onCopy }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-muted-foreground">No hay links creados aún. ¡Crea uno nuevo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <LinkCard key={index} link={link} onCopy={onCopy} />
      ))}
    </div>
  );
}
