"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LinkForm } from "./LinkForm";
import { LinkList } from "./LinkList";

interface ShortenedLink {
  original: string;
  shortened: string;
  title: string;
  image: string;
  clicks: number;
  createdAt: Date;
}

export function TinyURLApp() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);

  const handleCreateLink = (original: string, alias: string) => {
    const shortened = `https://tinyurl.alejoczombos.com.ar/${
      alias || Math.random().toString(36).substr(2, 6)
    }`;
    const newLink: ShortenedLink = {
      original,
      shortened,
      title: `Page Title for ${original.split("//")[1].split("/")[0]}`,
      image: `https://picsum.photos/seed/${Math.random()}/200/200`,
      clicks: 0,
      createdAt: new Date(),
    };
    setLinks([...links, newLink]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <main className="container mx-auto p-4 flex-grow max-w-3xl w-full">
        <LinkForm onCreateLink={handleCreateLink} />
        <LinkList links={links} onCopy={copyToClipboard} />
      </main>
      <Footer />
    </div>
  );
}
