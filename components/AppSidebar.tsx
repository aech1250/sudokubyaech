"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { name: "Classic", icon: "gamepad", href: "/" },
  { name: "Rules", icon: "scale", href: "/rules" },
  { name: "Solver", icon: "sudoku", href: "/solver" },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [settingHovered, setSettingHovered] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  return (
    <Sidebar
      side="left"
      collapsible={"none"}
      className="!min-h-screen min-w-75 bg-primary"
    >
      <SidebarHeader>
        <Image
          src="/Logo_Light.png"
          alt="Logo"
          height={59}
          width={236}
          className="p-0 mx-6 mt-6"
        />
      </SidebarHeader>
      <SidebarContent className="mt-1.75">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hovered === item.name;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={`w-59 h-12.5 mx-auto rounded-full ${
                      isActive || isHovered
                        ? "bg-background text-primary"
                        : "bg-primary text-background"
                    }`}
                    onMouseEnter={() => setHovered(item.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex flex-row items-center gap-0"
                    >
                      <Image
                        src={`/${item.icon}-${
                          isActive || isHovered ? "active" : "inactive"
                        }.svg`}
                        alt="Gamepad Icon"
                        width={24}
                        height={24}
                        className="ml-2 mr-2.5 !w-8.25 !h-7"
                      />
                      <span
                        className={`font-display text-2xl ${
                          isActive || isHovered
                            ? "text-primary"
                            : "text-background"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto !pb-5.25">
        <SidebarMenuItem className="list-none">
          <Popover>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                className={`w-59 h-12.5 mx-auto !gap-0 rounded-full ${
                  settingHovered || openSettings
                    ? "bg-secondary text-black"
                    : "bg-primary text-background"
                }`}
                onClick={() => setOpenSettings((prev) => !prev)}
                onMouseEnter={() => setSettingHovered(true)}
                onMouseLeave={() => setSettingHovered(false)}
              >
                <Image
                  src={`/settings-${
                    settingHovered || openSettings ? "active" : "inactive"
                  }.svg`}
                  alt="Gamepad Icon"
                  width={24}
                  height={24}
                  className="ml-2 mr-2.5 !w-8.25 !h-7"
                  unoptimized
                />
                <span
                  className={`font-display text-2xl ${
                    settingHovered || openSettings
                      ? "text-black"
                      : "text-background"
                  }`}
                >
                  Settings
                </span>
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="end"
              className="flex flex-col gap-3 ml-2 px-4 pt-3 h-37.5 w-45 font-sans text-base border-2 rounded-2xl bg-secondary border-black shadow-lg"
            >
              <div className="flex flex-row items-center">
                <Label htmlFor="lightening-mode">Lightening Mode</Label>
                <Switch id="lightening-mode" className="ml-auto " />
              </div>
              <div className="flex flex-row items-center">
                <Label htmlFor="auto-complete">Auto-Complete</Label>
                <Switch id="auto-complete" className="ml-auto " />
              </div>
              <div className="flex flex-row items-center">
                <Label htmlFor="highlight-peers">Highlight Peers</Label>
                <Switch id="highlight-peers" className="ml-auto " />
              </div>
              <div className="flex flex-row items-center">
                <Label htmlFor="highlight-same-number">
                  Highlight Same Number
                </Label>
                <Switch id="highlight-same-number" className="ml-auto " />
              </div>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
