import { demoResearchSources } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ResearchList = () => (
  <div className="space-y-2">
    {demoResearchSources.map((r) => (
      <Card key={r.id} className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.author}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>
          </div>
          <Badge variant="secondary" className="text-[10px] shrink-0">{r.type}</Badge>
        </div>
      </Card>
    ))}
  </div>
);

export default ResearchList;
