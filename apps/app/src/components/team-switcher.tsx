"use client";

import {
  AudioWaveform,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";
import { Button } from "@qco/ui/components/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@qco/ui/components/sidebar";
import { useTeams } from "~/hooks/use-teams";

// Маппинг для иконок команд
const teamIcons = {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} as const;

export function TeamSwitcher() {
  const { teams, teamsLoading } = useTeams();

  if (teamsLoading || !teams || teams.length === 0) {
    return null;
  }

  const currentTeam = teams[0];
  if (!currentTeam) {
    return null;
  }

  const TeamIcon =
    teamIcons[currentTeam.logo as keyof typeof teamIcons] || GalleryVerticalEnd;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Команда</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <TeamIcon className="h-4 w-4" />
                <span>{currentTeam.name}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
