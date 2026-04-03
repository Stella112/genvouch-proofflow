import { useState } from "react";
import { Plus, Users, TrendingUp, CircleDot, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Circle } from "@/lib/mockData";

interface Props {
  circles: Circle[];
  onCreateCircle: (name: string) => Promise<void> | void;
}

export function CirclesPanel({ circles, onCreateCircle }: Props) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      await onCreateCircle(name.trim());
      setName("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Lending Circles</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-emerald border-0 text-primary-foreground hover:opacity-90">
              <Plus className="mr-1 h-4 w-4" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md z-[60]">
            <DialogHeader>
              <DialogTitle>Create a Lending Circle</DialogTitle>
              <DialogDescription>
                Start a new peer-to-peer lending circle on GenLayer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="circle-name">Circle Name</Label>
                <Input
                  id="circle-name"
                  placeholder="e.g. Accra Devs Collective"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Pool size defaults to $500 GEN at 5% APY. Configurable after creation.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="gradient-emerald border-0 text-primary-foreground"
              >
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Launch Circle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {circles.map((circle, i) => (
          <Card
            key={circle.id}
            className="glass-card overflow-hidden border-border/50 transition-all hover:shadow-md"
            style={{ animationDelay: `${i * 100}ms`, animation: "fade-in-up 0.5s ease-out forwards", opacity: 0 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{circle.name}</CardTitle>
                <Badge
                  variant={circle.status === "active" ? "default" : "secondary"}
                  className={
                    circle.status === "active"
                      ? "bg-emerald-light text-accent-foreground border-0"
                      : ""
                  }
                >
                  {circle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-2">
                <CircleDot className="mx-auto mb-1 h-4 w-4 text-emerald" />
                <p className="text-xs text-muted-foreground">Pool</p>
                <p className="text-sm font-semibold">${circle.poolSize}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-indigo" />
                <p className="text-xs text-muted-foreground">APY</p>
                <p className="text-sm font-semibold">{circle.apy}%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <Users className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-sm font-semibold">{circle.members}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
