import { Loader2 } from "lucide-react";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-4 ${className || ""}`}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" data-testid="loader" />
    </div>
  );
}
