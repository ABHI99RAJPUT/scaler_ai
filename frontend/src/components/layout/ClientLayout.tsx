"use client";

import {
  AppLayout,
  SideNavigation,
  TopNavigation,
  Spinner,
} from "@cloudscape-design/components";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Login from "./Login";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  // Track whether dark mode is currently active
  const [isDark, setIsDark] = useState(false);

  // Sync isDark state with the actual DOM class (handles page refresh)
  useEffect(() => {
    const dark = document.documentElement.classList.contains("awsui-dark-mode");
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      applyMode(Mode.Light);
      setIsDark(false);
    } else {
      applyMode(Mode.Dark);
      setIsDark(true);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <div id="h" style={{ position: "sticky", top: 0, zIndex: 1002 }}>
        <TopNavigation
          identity={{
            href: "/",
            title: "Route 53",
            logo: {
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23EC7211'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='28' font-weight='bold' fill='white' font-family='Arial'%3E53%3C/text%3E%3C/svg%3E",
              alt: "Route 53",
            },
          }}
          utilities={[
            {
              type: "button",
              text: isDark ? "Enable light" : "Enable dark",
              iconName: isDark ? "status-positive" : "settings",
              onClick: toggleTheme,
            },
            {
              type: "menu-dropdown",
              text: user.username,
              description: user.email,
              iconName: "user-profile",
              onItemClick: (e) => {
                if (e.detail.id === "signout") {
                  logout();
                  router.push("/");
                }
              },
              items: [
                {
                  id: "account",
                  text: "Account",
                  items: [
                    { id: "username", text: `Signed in as: ${user.username}`, disabled: true },
                    { id: "email", text: user.email, disabled: true },
                  ],
                },
                { id: "divider1", text: "-" },
                { id: "signout", text: "Sign out" },
              ],
            },
          ]}
        />
      </div>
      <AppLayout
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        navigation={
          <SideNavigation
            activeHref={pathname}
            header={{ href: "/", text: "Route 53" }}
            onFollow={(event) => {
              if (!event.detail.external) {
                event.preventDefault();
                router.push(event.detail.href);
              }
            }}
            items={[
              { type: "link", text: "Dashboard", href: "/dashboard" },
              { type: "divider" },
              {
                type: "section",
                text: "DNS Management",
                defaultExpanded: true,
                items: [
                  { type: "link", text: "Hosted zones", href: "/hosted-zones" },
                ],
              },
              {
                type: "section",
                text: "Availability",
                defaultExpanded: true,
                items: [
                  { type: "link", text: "Health checks", href: "/health-checks" },
                ],
              },
              {
                type: "section",
                text: "Traffic",
                defaultExpanded: true,
                items: [
                  { type: "link", text: "Traffic policies", href: "/traffic-policies" },
                ],
              },
              {
                type: "section",
                text: "Resolver",
                defaultExpanded: true,
                items: [
                  { type: "link", text: "Resolver", href: "/resolver" },
                ],
              },
              {
                type: "section",
                text: "Account",
                defaultExpanded: true,
                items: [
                  { type: "link", text: "Profiles", href: "/profiles" },
                ],
              },
            ]}
          />
        }
        content={children}
        toolsHide={true}
      />
    </>
  );
}
