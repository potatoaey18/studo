import { demoExams } from "@/lib/demoData";
import { Card } from "@/components/ui/card";

const ExamCountdown = () => {
  const now = new Date();
  return (
    <div className="space-y-3">
      {demoExams.map((exam) => {
        const examDate = new Date(exam.date);
        const diff = Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        return (
          <Card key={exam.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">{exam.subject}</p>
                <p className="text-xs text-muted-foreground">{exam.location} · {exam.notes}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold">{diff}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExamCountdown;
