import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, Task } from "@/api/client";
import { Sidebar } from "@/components/Sidebar";
import { Loader } from "@/components/Loader";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  CheckSquare,
  PlusCircle,
  Store,
  HandMetal,
} from "lucide-react";

function getRoleLabel(role?: string) {
  if (role === "provider") return "Provider";
  return "User";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isProvider = user?.role === "provider";

  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [marketplaceCount, setMarketplaceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);

      const requests = [
        apiClient.fetch<Task[]>("/api/tasks/my-created-tasks"),
        apiClient.fetch<Task[]>("/api/tasks/my-assigned-tasks"),
        apiClient.fetch<Task[]>("/api/tasks/pending-tasks"),
      ] as const;

      const [createdRes, assignedRes, marketplaceRes] = await Promise.all(requests);

      if (createdRes.data) setCreatedTasks(createdRes.data);
      if (assignedRes.data) setAssignedTasks(assignedRes.data);
      if (marketplaceRes.data) setMarketplaceCount(marketplaceRes.data.length);

      setIsLoading(false);
    }

    fetchStats();
  }, []);

  const activeAssigned = assignedTasks.filter((t) => t.status === "accepted").length;
  const openCreated = createdTasks.filter((t) => t.status === "pending").length;

  const recentTasks = [...createdTasks, ...assignedTasks]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="text-welcome">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <Badge variant="secondary" className="capitalize" data-testid="badge-role">
                  {getRoleLabel(user?.role)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {isProvider
                  ? "Find open tasks in the marketplace, accept work, and mark tasks complete when done."
                  : "Post tasks to the marketplace and track them until a provider picks them up."}
              </p>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="card-stat-created">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Created Tasks</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{createdTasks.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {openCreated} waiting for a provider
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-assigned">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assignedTasks.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeAssigned} in progress
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-marketplace">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Open in Marketplace</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{marketplaceCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available to accept
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/10" data-testid="card-quick-actions">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isProvider ? (
                      <>
                        <Link href="/tasks/marketplace">
                          <Button
                            className="w-full justify-start gap-2"
                            variant="default"
                            size="sm"
                            data-testid="button-quick-marketplace"
                          >
                            <HandMetal className="h-4 w-4" />
                            Browse Marketplace
                          </Button>
                        </Link>
                        <Link href="/tasks/assigned">
                          <Button
                            className="w-full justify-start gap-2"
                            variant="outline"
                            size="sm"
                            data-testid="button-quick-assigned"
                          >
                            <CheckSquare className="h-4 w-4" />
                            My Assigned Tasks
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/tasks/create">
                          <Button
                            className="w-full justify-start gap-2"
                            variant="default"
                            size="sm"
                            data-testid="button-quick-create"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Create New Task
                          </Button>
                        </Link>
                        <Link href="/tasks/created">
                          <Button
                            className="w-full justify-start gap-2"
                            variant="outline"
                            size="sm"
                            data-testid="button-quick-created"
                          >
                            <ClipboardList className="h-4 w-4" />
                            My Created Tasks
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
              {isLoading ? (
                <Loader />
              ) : recentTasks.length === 0 ? (
                <div className="bg-card border rounded-lg p-8 text-center" data-testid="empty-activity">
                  <p className="text-muted-foreground text-sm">No recent activity to display.</p>
                  {isProvider ? (
                    <Link href="/tasks/marketplace">
                      <Button variant="outline" className="mt-4" data-testid="button-browse-marketplace">
                        Browse the marketplace
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/tasks/create">
                      <Button variant="outline" className="mt-4" data-testid="button-create-first">
                        Create your first task
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      showCreator={isProvider}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
