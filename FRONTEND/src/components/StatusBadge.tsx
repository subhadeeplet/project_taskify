import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "pending" | "accepted" | "completed" }) {
  const variants = {
    pending: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200",
    accepted: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200",
  };

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    completed: "Completed",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} border font-medium`} data-testid={`status-${status}`}>
      {labels[status]}
    </Badge>
  );
}
