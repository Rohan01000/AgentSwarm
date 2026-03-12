import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogEntry } from './EventLog';
import { PAYMENT_ROUTER_ADDRESS, PAYMENT_ROUTER_ABI } from '@/config/contracts';
import { arbitrumSepolia } from 'wagmi/chains';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, UserCheck, Send, Eye, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PaymentRouterDemoProps {
  onLog: (log: LogEntry) => void;
}

export const PaymentRouterDemo = ({ onLog }: PaymentRouterDemoProps) => {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('0.001');
  const [withdrawAmount, setWithdrawAmount] = useState('0.001');
  const [agentAddress, setAgentAddress] = useState('');
  const [payeeAddress, setPayeeAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('0.001');

  // Read balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: PAYMENT_ROUTER_ADDRESS,
    abi: PAYMENT_ROUTER_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read payment count
  const { data: paymentCount } = useReadContract({
    address: PAYMENT_ROUTER_ADDRESS,
    abi: PAYMENT_ROUTER_ABI,
    functionName: 'getPaymentCount',
  });

  // Read fee percentage
  const { data: feePercentage } = useReadContract({
    address: PAYMENT_ROUTER_ADDRESS,
    abi: PAYMENT_ROUTER_ABI,
    functionName: 'getFeePercentage',
  });

  // Check authorization
  const { data: isAuthorized } = useReadContract({
    address: PAYMENT_ROUTER_ADDRESS,
    abi: PAYMENT_ROUTER_ABI,
    functionName: 'isAuthorized',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write contracts
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract();
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { writeContract: authorize, data: authorizeHash, isPending: isAuthorizing } = useWriteContract();
  const { writeContract: initiatePayment, data: paymentHash, isPending: isPaying } = useWriteContract();

  // Wait for receipts
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });
  const { isSuccess: authorizeSuccess } = useWaitForTransactionReceipt({ hash: authorizeHash });
  const { isSuccess: paymentSuccess } = useWaitForTransactionReceipt({ hash: paymentHash });

  useEffect(() => {
    if (depositSuccess && depositHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Deposit confirmed! ${depositAmount} ETH deposited to PaymentRouter`, txHash: depositHash, timestamp: Date.now() });
      refetchBalance();
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (withdrawSuccess && withdrawHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Withdrawal confirmed! ${withdrawAmount} ETH withdrawn`, txHash: withdrawHash, timestamp: Date.now() });
      refetchBalance();
    }
  }, [withdrawSuccess]);

  useEffect(() => {
    if (authorizeSuccess && authorizeHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Agent authorized: ${agentAddress.slice(0, 10)}...`, txHash: authorizeHash, timestamp: Date.now() });
    }
  }, [authorizeSuccess]);

  useEffect(() => {
    if (paymentSuccess && paymentHash) {
      onLog({ id: Date.now().toString(), type: 'success', message: `✅ Payment initiated to ${payeeAddress.slice(0, 10)}... for ${paymentAmount} ETH`, txHash: paymentHash, timestamp: Date.now() });
      refetchBalance();
    }
  }, [paymentSuccess]);

  const handleDeposit = () => {
    onLog({ id: Date.now().toString(), type: 'pending', message: `💸 Depositing ${depositAmount} ETH to PaymentRouter...`, timestamp: Date.now() });
    deposit({
      address: PAYMENT_ROUTER_ADDRESS,
      abi: PAYMENT_ROUTER_ABI,
      functionName: 'deposit',
      value: parseEther(depositAmount),
      chain: arbitrumSepolia,
      account: address,
    });
  };

  const handleWithdraw = () => {
    onLog({ id: Date.now().toString(), type: 'pending', message: `📤 Withdrawing ${withdrawAmount} ETH...`, timestamp: Date.now() });
    withdraw({
      address: PAYMENT_ROUTER_ADDRESS,
      abi: PAYMENT_ROUTER_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
      chain: arbitrumSepolia,
      account: address,
    });
  };

  const handleAuthorize = () => {
    if (!agentAddress) return;
    onLog({ id: Date.now().toString(), type: 'pending', message: `🔑 Authorizing agent ${agentAddress.slice(0, 10)}...`, timestamp: Date.now() });
    authorize({
      address: PAYMENT_ROUTER_ADDRESS,
      abi: PAYMENT_ROUTER_ABI,
      functionName: 'authorizeAgent',
      args: [agentAddress as `0x${string}`],
      chain: arbitrumSepolia,
      account: address,
    });
  };

  const handleInitiatePayment = () => {
    if (!payeeAddress) return;
    onLog({ id: Date.now().toString(), type: 'pending', message: `💳 Initiating payment of ${paymentAmount} ETH to ${payeeAddress.slice(0, 10)}...`, timestamp: Date.now() });
    initiatePayment({
      address: PAYMENT_ROUTER_ADDRESS,
      abi: PAYMENT_ROUTER_ABI,
      functionName: 'initiatePayment',
      args: [payeeAddress as `0x${string}`, parseEther(paymentAmount)],
      chain: arbitrumSepolia,
      account: address,
    });
  };

  if (!isConnected) {
    return (
      <div className="neo-card p-8 text-center animate-pulse-glow">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-secondary" />
        <h3 className="text-2xl font-black mb-2">CONNECT WALLET</h3>
        <p className="text-muted-foreground">Connect your wallet to interact with the PaymentRouter contract</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center gradient-electric">
              <div className="text-xs font-bold text-white/80 uppercase">Your Balance</div>
              <div className="text-lg md:text-xl font-black text-white mt-1">
                {balance ? formatEther(balance as bigint) : '0'} ETH
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Your deposited balance in the PaymentRouter escrow</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase">Status</div>
              <div className={`text-lg font-black mt-1 ${isAuthorized ? 'text-success' : 'text-destructive'}`}>
                {isAuthorized ? '✓ AUTHORIZED' : '✗ NOT AUTH'}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Whether your address is authorized as an agent</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase">Payments</div>
              <div className="text-lg md:text-xl font-black mt-1">{paymentCount?.toString() ?? '0'}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Total payments processed by the router</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="neo-card p-4 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase">Fee %</div>
              <div className="text-lg md:text-xl font-black mt-1">{feePercentage?.toString() ?? '0'}%</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Protocol fee percentage on each payment</TooltipContent>
        </Tooltip>
      </div>

      {/* Actions Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Deposit */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-secondary" />
            DEPOSIT ETH
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Deposit ETH into the PaymentRouter escrow for autonomous payments</p>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border-2 border-foreground font-mono"
              placeholder="ETH amount"
            />
            <Button onClick={handleDeposit} disabled={isDepositing} variant="hero" className="shrink-0">
              {isDepositing ? '...' : 'DEPOSIT'}
            </Button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <ArrowUpFromLine className="h-5 w-5 text-accent" />
            WITHDRAW ETH
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Withdraw your deposited ETH from the escrow</p>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.001"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border-2 border-foreground font-mono"
              placeholder="ETH amount"
            />
            <Button onClick={handleWithdraw} disabled={isWithdrawing} variant="outline" className="shrink-0">
              {isWithdrawing ? '...' : 'WITHDRAW'}
            </Button>
          </div>
        </div>

        {/* Authorize Agent */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            AUTHORIZE AGENT
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Grant another address permission to initiate payments on your behalf</p>
          <div className="flex gap-2">
            <Input
              value={agentAddress}
              onChange={(e) => setAgentAddress(e.target.value)}
              className="border-2 border-foreground font-mono text-xs"
              placeholder="0x... agent address"
            />
            <Button onClick={handleAuthorize} disabled={isAuthorizing || !agentAddress} variant="secondary" className="shrink-0">
              {isAuthorizing ? '...' : 'AUTH'}
            </Button>
          </div>
        </div>

        {/* Initiate Payment */}
        <div className="neo-card p-5">
          <h4 className="font-black text-lg mb-3 flex items-center gap-2">
            <Send className="h-5 w-5 text-hot-fuchsia" />
            INITIATE PAYMENT
          </h4>
          <p className="text-xs text-muted-foreground mb-3">Send a payment from your escrow to a payee address</p>
          <div className="space-y-2">
            <Input
              value={payeeAddress}
              onChange={(e) => setPayeeAddress(e.target.value)}
              className="border-2 border-foreground font-mono text-xs"
              placeholder="0x... payee address"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.001"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="border-2 border-foreground font-mono"
                placeholder="ETH"
              />
              <Button onClick={handleInitiatePayment} disabled={isPaying || !payeeAddress} variant="hero" className="shrink-0">
                {isPaying ? '...' : 'PAY'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Arbiscan Link */}
      <div className="text-center">
        <a
          href={`https://sepolia.arbiscan.io/address/${PAYMENT_ROUTER_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline"
        >
          <Eye className="h-4 w-4" />
          View PaymentRouter on Arbiscan
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
