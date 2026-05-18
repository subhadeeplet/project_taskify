import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { apiClient, Task } from "@/api/client";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard } from "@/components/TaskCard";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, PlusCircle } from "lucide-react";

export default function CreatedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await apiClient.fetch<Task[]>("/api/tasks/my-created-tasks");
    
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

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Created Tasks</h1>
                <p className="text-muted-foreground text-sm mt-1">Tasks you have posted to the marketplace.</p>
              </div>
              <Link href="/tasks/create">
                <Button className="gap-2 shrink-0" data-testid="button-create">
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="py-12"><Loader /></div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-lg text-center" data-testid="empty-created">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tasks created</h3>
                <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
                  You haven't created any tasks yet. Create a task to assign work to others.
                </p>
                <Link href="/tasks/create">
                  <Button data-testid="button-create-first">Create your first task</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    showCreator={!!task.createdBy}
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