import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogEntry } from './EventLog';
import { Bot, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface BotAPIDemoProps {
  onLog: (log: LogEntry) => void;
}

export const BotAPIDemo = ({ onLog }: BotAPIDemoProps) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateX402Flow = async () => {
    setIsSimulating(true);

    // Step 1: Bot requests service
    onLog({
      id: Date.now().toString(),
      type: 'info',
      message: '🤖 AgentBot-01 requesting data from WeatherAPI service...',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 2: 402 Payment Required
    onLog({
      id: Date.now().toString() + '-1',
      type: 'pending',
      message: '⚡ x402 Protocol: Payment Required - 0.002 ETH for API access',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Bot initiates payment via PaymentRouter
    onLog({
      id: Date.now().toString() + '-2',
      type: 'pending',
      message: '💸 Bot initiating payment via PaymentRouter contract...',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Payment confirmed
    onLog({
      id: Date.now().toString() + '-3',
      type: 'success',
      message: '✅ Payment confirmed on-chain! Service unlocked.',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 5: Service delivered
    onLog({
      id: Date.now().toString() + '-4',
      type: 'success',
      message: '📦 WeatherAPI delivered data payload to AgentBot-01',
      timestamp: Date.now(),
    });

    setIsSimulating(false);
  };

  const simulateBotSplit = async () => {
    setIsSimulating(true);

    onLog({
      id: Date.now().toString(),
      type: 'info',
      message: '👥 Bot Swarm (3 agents) needs shared compute service - 0.03 ETH total',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    onLog({
      id: Date.now().toString() + '-1',
      type: 'pending',
      message: '🤖 AgentBot-01 creating CostSplitter agreement...',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    onLog({
      id: Date.now().toString() + '-2',
      type: 'info',
      message: '💰 AgentBot-01 contributed 0.01 ETH (1/3)',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    onLog({
      id: Date.now().toString() + '-3',
      type: 'info',
      message: '💰 AgentBot-02 contributed 0.01 ETH (2/3)',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    onLog({
      id: Date.now().toString() + '-4',
      type: 'info',
      message: '💰 AgentBot-03 contributed 0.01 ETH (3/3)',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    onLog({
      id: Date.now().toString() + '-5',
      type: 'success',
      message: '🎉 All contributions received! Auto-settling 0.03 ETH to compute provider',
      timestamp: Date.now(),
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    onLog({
      id: Date.now().toString() + '-6',
      type: 'success',
      message: '⚡ Compute resources unlocked for bot swarm',
      timestamp: Date.now(),
    });

    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="neo-card p-6 gradient-full">
        <div className="bg-background/95 backdrop-blur p-6 border-4 border-foreground">
          <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
            <Bot className="h-8 w-8 text-secondary" />
            BOT/API SIMULATION
          </h2>
          <p className="text-lg mb-6">
            Watch how autonomous agents use our payment infrastructure to access services and split costs—all onchain, all automatic.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={simulateX402Flow}
              disabled={isSimulating}
              variant="hero"
              size="lg"
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <Zap className="h-6 w-6" />
              <div className="font-black text-lg">SIMULATE x402 PAYMENT</div>
              <div className="text-xs font-normal opacity-90">Bot pays for API access instantly</div>
            </Button>

            <Button
              onClick={simulateBotSplit}
              disabled={isSimulating}
              variant="secondary"
              size="lg"
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <Bot className="h-6 w-6" />
              <div className="font-black text-lg">SIMULATE BOT SPLIT</div>
              <div className="text-xs font-normal opacity-90">3 bots split service cost equally</div>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="neo-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <h3 className="text-xl font-black">x402 PROTOCOL</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">1.</span>
              <span>Bot/Agent requests service or data from API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">2.</span>
              <span>Service responds with "402 Payment Required" + payment details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">3.</span>
              <span>Bot triggers PaymentRouter.initiatePayment() onchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">4.</span>
              <span>Payment confirmed → Service automatically unlocks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">5.</span>
              <span>Zero human intervention, instant settlement</span>
            </li>
          </ul>
        </div>

        <div className="neo-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-black">WHY THIS MATTERS</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="border-l-4 border-secondary pl-3">
              <strong>Autonomous Economies:</strong> Bots transact without human wallets or approvals
            </li>
            <li className="border-l-4 border-accent pl-3">
              <strong>Transparent & Auditable:</strong> Every payment recorded onchain via Stylus contracts
            </li>
            <li className="border-l-4 border-primary pl-3">
              <strong>Low Gas, High Speed:</strong> Arbitrum Stylus (Rust) = blazing fast, cheap transactions
            </li>
            <li className="border-l-4 border-hot-fuchsia pl-3">
              <strong>Composable:</strong> Any agent/API can integrate via standard interfaces
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
