import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { apiClient, Task } from "@/api/client";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard } from "@/components/TaskCard";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CheckSquare } from "lucide-react";

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await apiClient.fetch<Task[]>("/api/tasks/my-assigned-tasks");
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to load tasks",
        description: error,
      });
    } else if (data) {
      setTasks(data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId);
    try {
      const { error } = await apiClient.fetch(`/api/tasks/complete-task/${taskId}`, {
        method: "PUT",
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Action failed",
          description: error,
        });
        return;
      }

      toast({
        title: "Task completed",
        description: "Great job completing the task!",
      });
      
      // Update local state without full refetch for better UX
      setTasks(current => 
        current.map(t => 
          t.id === taskId ? { ...t, status: "completed" as const } : t
        )
      );
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Assigned Tasks</h1>
              <p className="text-muted-foreground text-sm mt-1">Tasks you have claimed and need to complete.</p>
            </div>

            {isLoading ? (
              <div className="py-12"><Loader /></div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-lg text-center" data-testid="empty-assigned">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tasks assigned</h3>
                <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
                  You don't have any tasks assigned to you right now. Check the marketplace to find work.
                </p>
                <Link href="/tasks/marketplace">
                  <Button variant="outline" data-testid="button-browse-marketplace">Browse Marketplace</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    action={
                      task.status === "accepted" ? (
                        <Button 
                          className="w-full gap-2" 
                          onClick={() => handleComplete(task.id)}
                          disabled={completingId === task.id}
                          data-testid={`button-complete-${task.id}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {completingId === task.id ? "Completing..." : "Mark Complete"}
                        </Button>
                      ) : null
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}