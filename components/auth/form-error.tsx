import { AlertCircle } from "lucide-react";

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 my-4 text-xs font-medium bg-destructive/50 text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
