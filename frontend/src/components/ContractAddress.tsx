import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ContractAddressProps {
  address: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

export const ContractAddress = ({ address, label, variant = 'primary' }: ContractAddressProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({ title: "Copied!", description: "Address copied to clipboard" });
  };

  const openArbiscan = () => {
    window.open(`https://sepolia.arbiscan.io/address/${address}`, '_blank');
  };

  const gradientClass = variant === 'primary' ? 'gradient-electric' : 'gradient-fire';

  return (
    <div className={`neo-border p-4 ${gradientClass}`}>
      <div className="text-xs font-bold text-white mb-2 uppercase tracking-wider">{label}</div>
      <div className="flex items-center justify-between gap-2 bg-background/90 backdrop-blur p-3 border-2 border-foreground">
        <code className="text-xs font-mono text-foreground break-all">{address}</code>
        <div className="flex gap-1">
          <Button
            onClick={copyAddress}
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            onClick={openArbiscan}
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
