// components/pdf-tool-card.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PdfToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  isNew?: boolean;
}

export function PdfToolCard({
  name,
  description,
  icon,
  iconBg,
  href,
  isNew
}: PdfToolCardProps) {
  return (
    <Link href={href} className="block h-full transition-transform hover:scale-[1.02]">
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start space-x-4 mb-4">
            <div className={cn("p-2 rounded-lg", iconBg)}>
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{name}</h3>
                {isNew && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
                    New!
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}