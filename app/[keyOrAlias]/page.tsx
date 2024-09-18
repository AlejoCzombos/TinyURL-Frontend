// app/[alias]/page.tsx
import { Suspense } from "react";
import { RedirectComponent } from "@/components/RedirectComponent";
import { Toaster } from "@/components/ui/toaster";

export default function RedirectPage({ params }: { params: { keyOrAlias: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Suspense fallback={<p>Cargando...</p>}>
          <RedirectComponent keyOrAlias={params.keyOrAlias} />
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
}
