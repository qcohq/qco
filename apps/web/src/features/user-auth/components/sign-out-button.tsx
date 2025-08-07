"use client";

import { Button } from "@qco/ui/components/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

interface SignOutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({
  variant = "ghost",
  size = "default",
  className = "",
  children,
}: SignOutButtonProps) {
  const { signOut, isSigningOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </>
      )}
    </Button>
  );
}
