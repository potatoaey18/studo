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
}

function ItemModal<T extends Record<string, any>>({
  open,
  onClose,
  title,
  item,
  fields,
  onUpdate,
  extraContent,
}: ItemModalProps<T>) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
          <DialogDescription>Edit details below. Changes save automatically.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {extraContent}
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  value={item[f.key] ?? ""}
                  onChange={(e) => onUpdate(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                />
              ) : f.type === "select" && f.options ? (
                <DynamicSelect
                  options={f.options}
                  value={String(item[f.key] ?? "")}
                  onChange={(v) => onUpdate(f.key, v)}
                  placeholder={f.placeholder || f.label}
                />
              ) : (
                <Input
                  type={f.type || "text"}
                  value={item[f.key] ?? ""}
                  onChange={(e) =>
                    onUpdate(f.key, f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                  }
                  placeholder={f.placeholder}
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
