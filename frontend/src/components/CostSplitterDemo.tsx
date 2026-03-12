import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogEntry } from './EventLog';
import { COST_SPLITTER_ADDRESS, COST_SPLITTER_ABI } from '@/config/contracts';
import { arbitrumSepolia } from 'wagmi/chains';
import { Users, PlusCircle, HandCoins, Eye, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CostSplitterDemoProps {
  onLog: (log: LogEntry) => void;
}

export const CostSplitterDemo = ({ onLog }: CostSplitterDemoProps) => {
  const { address, isConnected } = useAccount();
  const [participantCount, setParticipantCount] = useState('3');
  const [totalAmount, setTotalAmount] = useState('0.003');
  const [payeeAddress, setPayeeAddress] = useState('');
  const [agreementId, setAgreementId] = useState('');
  const [contributeAmount, setContributeAmount] = useState('0.001');

  // Read agreement count
  const { data: agreementCount } = useReadContract({
    address: COST_SPLITTER_ADDRESS,
    abi: COST_SPLITTER_ABI,
    functionName: 'getAgreementCount',
  });

  // Write contracts
  const { writeContract: createAgreement, data: createHash, isPending: isCreating } = useWriteContract();
  const { writeContract: contribute, data: contributeHash, isPending: isContributing } = useWriteContract();

  const { isSuccess: createSuccess } = useWaitForTransactionReceipt({ hash: createHash });
  const { isSuccess: contributeSuccess } = useWaitForTransactionReceipt({ hash: contributeHash });

  useEffect(() => {
    if (createSuccess && createHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Agreement created! ${participantCount} participants, ${totalAmount} ETH total`, txHash: createHash, timestamp: Date.now() });
    }
  }, [createSuccess]);

  useEffect(() => {
    if (contributeSuccess && contributeHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Contribution of ${contributeAmount} ETH confirmed!`, txHash: contributeHash, timestamp: Date.now() });
    }
  }, [contributeSuccess]);

  const handleCreateAgreement = () => {
    if (!payeeAddress) return;
    onLog({ id: Date.now().toString(), type: 'pending', message: `📝 Creating agreement: ${participantCount} participants, ${totalAmount} ETH...`, timestamp: Date.now() });
    createAgreement({
      address: COST_SPLITTER_ADDRESS,
      abi: COST_SPLITTER_ABI,
      functionName: 'createAgreement',
      args: [BigInt(participantCount), parseEther(totalAmount), payeeAddress as `0x${string}`],
      chain: arbitrumSepolia,
      account: address,
    });
  };

  const handleContribute = () => {
    if (!agreementId) return;
    onLog({ id: Date.now().toString(), type: 'pending', message: `💰 Contributing ${contributeAmount} ETH to agreement...`, timestamp: Date.now() });
    contribute({
      address: COST_SPLITTER_ADDRESS,
      abi: COST_SPLITTER_ABI,
      functionName: 'contribute',
      args: [agreementId as `0x${string}`],
      value: parseEther(contributeAmount),
      chain: arbitrumSepolia,
      account: address,
    });
  };

  if (!isConnected) {
    return (
      <div className="neo-card p-8 text-center animate-pulse-glow">
        <Users className="h-12 w-12 mx-auto mb-4 text-accent" />
        <h3 className="text-2xl font-black mb-2">CONNECT WALLET</h3>
        <p className="text-muted-foreground">Connect your wallet to interact with the CostSplitter contract</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center gradient-fire">
              <div className="text-xs font-bold text-white/80 uppercase">Total Agreements</div>
              <div className="text-2xl font-black text-white mt-1">{agreementCount?.toString() ?? '0'}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Total split agreements created on the CostSplitter contract</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center gradient-sunset">
              <div className="text-xs font-bold text-white/80 uppercase">Your Address</div>
              <div className="text-sm font-mono font-bold text-white mt-2 truncate">{address}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Your connected wallet address</TooltipContent>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Create Agreement */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-accent" />
            CREATE AGREEMENT
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Create a new cost-split agreement for multiple bots/agents to contribute</p>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Participants</label>
                <Input
                  type="number"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(e.target.value)}
                  className="border-2 border-foreground font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Total (ETH)</label>
                <Input
                  type="number"
                  step="0.001"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="border-2 border-foreground font-mono mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Payee Address</label>
              <Input
                value={payeeAddress}
                onChange={(e) => setPayeeAddress(e.target.value)}
                className="border-2 border-foreground font-mono text-xs mt-1"
                placeholder="0x... payee"
              />
            </div>
            <Button onClick={handleCreateAgreement} disabled={isCreating || !payeeAddress} variant="hero" className="w-full">
              {isCreating ? 'CREATING...' : 'CREATE AGREEMENT'}
            </Button>
          </div>
        </div>

        {/* Contribute */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-secondary" />
            CONTRIBUTE TO AGREEMENT
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Contribute your share to an existing split agreement</p>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Agreement ID</label>
              <Input
                value={agreementId}
                onChange={(e) => setAgreementId(e.target.value)}
                className="border-2 border-foreground font-mono text-xs mt-1"
                placeholder="0x... agreement ID (bytes32)"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Amount (ETH)</label>
              <Input
                type="number"
                step="0.001"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                className="border-2 border-foreground font-mono mt-1"
              />
            </div>
            <Button onClick={handleContribute} disabled={isContributing || !agreementId} variant="secondary" className="w-full">
              {isContributing ? 'CONTRIBUTING...' : 'CONTRIBUTE'}
            </Button>
          </div>
        </div>
      </div>

      {/* Arbiscan Link */}
      <div className="text-center">
        <a
          href={`https://sepolia.arbiscan.io/address/${COST_SPLITTER_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
        >
          <Eye className="h-4 w-4" />
          View CostSplitter on Arbiscan
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
