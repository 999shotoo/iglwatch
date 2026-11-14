"use client";

import { FormEvent, ReactElement, useState } from "react";
import { Bug, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ReportDialogProps = {
  context?: string;
  trigger?: ReactElement;
};

export function ReportDialog({ context = "General site", trigger }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const issueType = String(formData.get("issueType") || "Other");
    const details = String(formData.get("details") || "").trim();
    const severity = String(formData.get("severity") || "Low");
    const pageUrl = window.location.href;

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Reporting is not configured yet.");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "IGLWatch Reports",
          content: "@everyone",
          allowed_mentions: { parse: ["everyone"] },
          embeds: [
            {
              title: `UI issue: ${issueType}`,
              color: severity === "High" ? 0xef4444 : severity === "Medium" ? 0xf59e0b : 0x3b82f6,
              fields: [
                { name: "Context", value: context, inline: false },
                { name: "Severity", value: severity, inline: true },
                { name: "Page", value: pageUrl, inline: false },
                { name: "Details", value: details, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Discord rejected the report.");
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send the report.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button variant="outline" size="sm"><Bug /> Report issue</Button>} />
      <DialogContent className="sm:max-w-lg">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="size-10 text-emerald-500" />
            <DialogHeader>
              <DialogTitle>Report sent</DialogTitle>
              <DialogDescription>Thanks. The issue has been sent to the site team.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => { setStatus("idle"); setOpen(false); }}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Report a UI issue</DialogTitle>
              <DialogDescription>Tell us what went wrong on this page. The current page and content are included automatically.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-xs font-medium">Issue type</span>
                <select name="issueType" defaultValue="Layout or visual" className="h-9 w-full rounded-md border border-border/60 bg-muted/50 px-2 text-sm outline-none focus-visible:border-border">
                  <option>Layout or visual</option>
                  <option>Broken button or link</option>
                  <option>Video or playback</option>
                  <option>Mobile or responsive</option>
                  <option>Accessibility</option>
                  <option>Performance</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium">Severity</span>
                <select name="severity" defaultValue="Low" className="h-9 w-full rounded-md border border-border/60 bg-muted/50 px-2 text-sm outline-none focus-visible:border-border">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium">What happened?</span>
              <textarea name="details" required minLength={10} rows={5} placeholder="Describe the issue and what you expected to happen..." className="w-full resize-y rounded-md border border-border/60 bg-muted/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-border" />
            </label>

            {status === "error" && <p className="text-xs text-destructive">{errorMessage}</p>}

            <DialogFooter>
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? <Loader2 className="animate-spin" /> : <Send />}
                {status === "sending" ? "Sending..." : "Send report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
