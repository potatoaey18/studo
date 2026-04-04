import { demoResources } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const ResourceList = () => (
  <div className="space-y-2">
    {demoResources.map((r) => (
      <Card key={r.id} className="p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium flex items-center gap-1.5">
            {r.title} <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </p>
          <p className="text-xs text-muted-foreground">{r.course}</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
      </Card>
    ))}
  </div>
);

export default ResourceList;
