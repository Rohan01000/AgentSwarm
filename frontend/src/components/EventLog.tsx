import { ExternalLink, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface LogEntry {
  id: string;
  type: 'success' | 'pending' | 'error' | 'info';
  message: string;
  txHash?: string;
  timestamp: number;
}

interface EventLogProps {
  logs: LogEntry[];
}

export const EventLog = ({ logs }: EventLogProps) => {
  const getTypeStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return { badge: 'bg-success text-white', border: 'border-l-success' };
      case 'pending': return { badge: 'bg-warning text-foreground', border: 'border-l-warning' };
      case 'error': return { badge: 'bg-destructive text-white', border: 'border-l-destructive' };
      default: return { badge: 'bg-muted text-foreground', border: 'border-l-muted-foreground' };
    }
  };

  return (
    <div className="neo-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Terminal className="h-5 w-5 text-secondary" />
          EVENT LOG
        </h3>
        {logs.length > 0 && (
          <Badge variant="outline" className="font-mono text-xs">{logs.length} events</Badge>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Terminal className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No events yet — interact with contracts or run a simulation</p>
          </div>
        ) : (
          logs.map((log) => {
            const styles = getTypeStyles(log.type);
            return (
              <div key={log.id} className={`border-2 border-foreground border-l-[6px] ${styles.border} p-3 bg-background transition-all hover:translate-x-1`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge className={`${styles.badge} text-[10px] px-2 py-0`}>{log.type.toUpperCase()}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm font-medium">{log.message}</p>
                {log.txHash && (
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline bg-secondary/10 px-2 py-1 border border-secondary/30"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on Arbiscan →
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
