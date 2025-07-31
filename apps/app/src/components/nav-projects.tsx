"use client";

import type { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Проекты</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild tooltip={project.name}>
              <a href={project.url}>
                {project.icon && <project.icon />}
                <span>{project.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
