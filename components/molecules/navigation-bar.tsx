"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock authentication hook (replace with your actual auth logic)
function useAuth() {
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);

  const signIn = () =>
    setUser({ name: "Jane Doe", email: "jane@example.com", image: "" });
  const signOut = () => setUser(null);

  return { user, signIn, signOut };
}

export default function NavigationBar() {
  const { user, signIn, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
      <Link href="/" className="font-bold text-lg">
        OpenFund
      </Link>
      <div className="flex items-center gap-4">
        {/* Hide the "Sign In" button on the Sign Up page */}
        {!user && pathname !== "/sign-up" && pathname !== "/sign-in" && (
          <Link href="/sign-in">
            <Button variant={"default"}>Sign In</Button>
          </Link>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
