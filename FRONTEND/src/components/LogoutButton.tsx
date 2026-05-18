import { LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean;
  label?: string;
}

export function LogoutButton({
  showIcon = true,
  label = "Logout",
  variant = "outline",
  className,
  children,
  ...props
}: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={logout}
      data-testid="button-logout"
      {...props}
    >
      {children ?? (
        <>
          {showIcon && <LogOut className="h-4 w-4" />}
          {label ? label : null}
        </>
      )}
    </Button>
  );
}
