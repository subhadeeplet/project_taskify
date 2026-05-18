import { Task } from "@/api/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  action?: React.ReactNode;
  showCreator?: boolean;
}

export function TaskCard({ task, action, showCreator = false }: TaskCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md" data-testid={`card-task-${task.id}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl leading-tight text-foreground">{task.title}</CardTitle>
          <StatusBadge status={task.status} />
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto text-sm text-muted-foreground">
        <div className="flex flex-col gap-1.5">
          <div>Created: {task.createdAt ? format(new Date(task.createdAt), "MMM d, yyyy") : "Unknown"}</div>
          {showCreator && task.createdBy && (
            <div>
              Posted by:{" "}
              <span className="font-medium text-foreground">{task.createdBy.name}</span>
            </div>
          )}
          {task.assignedUser && (
            <div>Assignee: <span className="font-medium text-foreground">{task.assignedUser.name}</span></div>
          )}
        </div>
      </CardContent>
      {action && (
        <CardFooter className="pt-2 pb-4">
          {action}
        </CardFooter>
      )}
    </Card>
  );
}
