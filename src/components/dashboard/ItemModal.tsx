import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DynamicSelect from "@/components/DynamicSelect";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
}

interface ItemModalProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  title: string;
  item: T | null;
  fields: FieldConfig[];
  onUpdate: (key: string, value: any) => void;
  extraContent?: ReactNode;
  currentUserId?: string;
}

function ItemModal<T extends Record<string, any>>({
  open,
  onClose,
  title,
  item,
  fields,
  onUpdate,
  extraContent,
  currentUserId,
}: ItemModalProps<T>) {
  if (!item) return null;

  const isOwner = !currentUserId || item.user_id === currentUserId;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
          <DialogDescription>
            {isOwner ? "Edit details below. Changes save automatically." : "You can only view this task."}
          </DialogDescription>
        </DialogHeader>

        {!isOwner && (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Only the task creator can edit or delete this task.
          </div>
        )}

        <div className="space-y-4 pt-2">
          {extraContent}
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  value={item[f.key] ?? ""}
                  onChange={(e) => isOwner && onUpdate(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  disabled={!isOwner}
                  className={!isOwner ? "cursor-not-allowed opacity-60" : ""}
                />
              ) : f.type === "select" && f.options ? (
                <DynamicSelect
                  options={f.options}
                  value={String(item[f.key] ?? "")}
                  onChange={(v) => isOwner && onUpdate(f.key, v)}
                  placeholder={f.placeholder || f.label}
                />
              ) : (
                <Input
                  type={f.type || "text"}
                  value={item[f.key] ?? ""}
                  onChange={(e) =>
                    isOwner && onUpdate(f.key, f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                  }
                  placeholder={f.placeholder}
                  disabled={!isOwner}
                  className={!isOwner ? "cursor-not-allowed opacity-60" : ""}
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ItemModal;