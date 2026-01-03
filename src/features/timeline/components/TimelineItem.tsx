import { formatDistanceToNow } from 'date-fns';
import {
  CreditCard,
  UserPlus,
  RefreshCw,
  XCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { WebhookEvent } from '../types';

interface TimelineItemProps {
  event: WebhookEvent;
  onClick?: () => void;
}

const eventConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  INITIAL_PURCHASE: {
    icon: CreditCard,
    color: 'bg-green-500',
    label: 'Initial Purchase',
  },
  RENEWAL: {
    icon: RefreshCw,
    color: 'bg-blue-500',
    label: 'Renewal',
  },
  CANCELLATION: {
    icon: XCircle,
    color: 'bg-red-500',
    label: 'Cancellation',
  },
  SUBSCRIBER_ALIAS: {
    icon: UserPlus,
    color: 'bg-purple-500',
    label: 'Subscriber Alias',
  },
  BILLING_ISSUE: {
    icon: AlertCircle,
    color: 'bg-yellow-500',
    label: 'Billing Issue',
  },
  PRODUCT_CHANGE: {
    icon: DollarSign,
    color: 'bg-orange-500',
    label: 'Product Change',
  },
};

const defaultConfig = {
  icon: AlertCircle,
  color: 'bg-slate-500',
  label: 'Unknown Event',
};

export function TimelineItem({ event, onClick }: TimelineItemProps) {
  const config = eventConfig[event.type] ?? defaultConfig;
  const Icon = config.icon;

  const formattedTime = formatDistanceToNow(new Date(event.created_at), {
    addSuffix: true,
  });

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${config.color} text-white`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{config.label}</Badge>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            User: {event.app_user_id}
          </p>
        </div>
      </div>
    </Card>
  );
}
