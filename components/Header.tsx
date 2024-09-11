import { GithubIcon, LinkedinIcon, GlobeIcon } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 w-full">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">TinyURL</h1>
        <nav className="flex space-x-4">
          <a
            href="https://github.com/AlejoCzombos"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80"
          >
            <GithubIcon className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/alejoczombos/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80"
          >
            <LinkedinIcon className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="https://www.alejoczombos.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80"
          >
            <GlobeIcon className="h-6 w-6" />
            <span className="sr-only">Portfolio</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
