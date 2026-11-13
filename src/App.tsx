import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const AppCrashed = () => (
  <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
    <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
    <p className="text-muted-foreground">Your data was not sent anywhere. Reload the page to continue.</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="bg-primary text-primary-foreground font-semibold py-2.5 px-6 rounded-2xl"
    >
      Reload
    </button>
  </main>
);

const App = () => (
  <ErrorBoundary fallback={<AppCrashed />}>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
