import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebhookEvents } from '../hooks/useWebhookEvents';
import { TimelineItem } from './TimelineItem';
import { EventDetailSheet } from './EventDetailSheet';
import type { WebhookEvent } from '../types';

export function TimelineFeed() {
  const { data, isLoading } = useWebhookEvents();
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleEventClick = (event: WebhookEvent) => {
    setSelectedEvent(event);
    setSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Waiting for events...</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4 pr-4">
          {data.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      </ScrollArea>
      <EventDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        payload={selectedEvent?.original_payload ?? null}
      />
    </>
  );
}
