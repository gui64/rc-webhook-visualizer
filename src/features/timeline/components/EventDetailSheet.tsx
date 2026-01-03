import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: Record<string, unknown> | null;
}

export function EventDetailSheet({
  open,
  onOpenChange,
  payload,
}: EventDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Event Details</SheetTitle>
          <SheetDescription>Raw JSON payload from webhook</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
            {payload ? JSON.stringify(payload, null, 2) : 'No data'}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
