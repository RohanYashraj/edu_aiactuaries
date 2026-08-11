"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { mirrorRole } from "@/lib/clerk-metadata";

type Role = Doc<"users">["role"];

const ROLES: Role[] = ["member", "content_manager", "admin"];

const ROLE_LABELS: Record<Role, string> = {
  member: "Member",
  content_manager: "Content manager",
  admin: "Administrator",
};

export function UsersTable() {
  const users = useQuery(api.users.adminList, {});
  const stats = useQuery(api.users.adminStats);
  const setRole = useMutation(api.users.adminSetRole);
  const [filter, setFilter] = useState("");

  if (users === undefined) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const term = filter.trim().toLowerCase();
  const rows = term
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      )
    : users;

  async function changeRole(user: Doc<"users">, role: Role) {
    try {
      await setRole({ userId: user._id as Id<"users">, role });
      // Keep the Clerk metadata mirror in step so the middleware fast-path
      // doesn't bounce them away from /admin on their next navigation.
      await mirrorRole(user.clerkId, role);
      toast.success(`${user.name} is now ${ROLE_LABELS[role].toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change role");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or email"
          className="max-w-xs"
        />
        {stats ? (
          <p className="text-sm text-muted-foreground">
            {stats.total} total · {stats.onboarded} completed onboarding
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-40">Profile</TableHead>
              <TableHead className="w-48">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.onboardingCompletedAt ? (
                    <span className="text-sm text-muted-foreground">
                      {user.institution ?? user.experienceLevel ?? "Complete"}
                    </span>
                  ) : (
                    <Badge variant="outline">Not onboarded</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v) => changeRole(user, v as Role)}
                  >
                    <SelectTrigger size="sm" className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
