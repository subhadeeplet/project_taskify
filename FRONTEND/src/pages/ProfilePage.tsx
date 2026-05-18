import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/LogoutButton";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your personal information.</p>
            </div>

            <Card data-testid="card-profile">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your identity details and role.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user?.name || ""} readOnly className="bg-muted/50" data-testid="input-profile-name" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email || ""} readOnly className="bg-muted/50" data-testid="input-profile-email" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Account Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <div className="font-medium capitalize" data-testid="text-profile-role">{user?.role || "User"}</div>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs text-muted-foreground">User ID</Label>
                      <div className="font-mono text-xs bg-muted p-2 rounded truncate" data-testid="text-profile-id">
                        {user?.id || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-session">
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>Sign out of your account on this device.</CardDescription>
              </CardHeader>
              <CardContent>
                <LogoutButton variant="destructive" className="gap-2" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
