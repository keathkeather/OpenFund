"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/app/store/user";

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Hydrate user from server cookie on first mount (e.g., page refresh)
  React.useEffect(() => {
    if (user) return;
    (async () => {
      try {
        const res = await fetch("/services/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) setUser(data.user);
      } catch {
        // ignore
      }
    })();
  }, [user, setUser]);

  const handleSignOut = async () => {
    try {
      // Clear HttpOnly cookie on server
      await fetch("/services/session", { method: "DELETE" }).catch(() => {});
    } finally {
      clear();
      router.push("/sign-in");
    }
  };

  if (!mounted) return null;

  const hideSignIn = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
      <Link href="/" className="font-bold text-lg">
        OpenFund
      </Link>

      <div className="flex items-center gap-4">
        {!user && !hideSignIn && (
          <Link href="/sign-in">
            <Button variant="default">Sign In</Button>
          </Link>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? user.email ?? "User"} />
                  <AvatarFallback>
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.displayName || user.email || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <div className="font-medium">{user.displayName || "Account"}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
