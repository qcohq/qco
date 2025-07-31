"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex h-full w-full flex-col gap-4",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Sidebar.displayName = "Sidebar"; 