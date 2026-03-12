import { Code2, Rocket, Shield, Zap } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div className="space-y-6">
      <div className="neo-card p-8 gradient-electric">
        <div className="bg-background/95 backdrop-blur p-6 border-4 border-foreground">
          <h2 className="text-4xl font-black mb-4">AGENTSWARM PAYMENT SYSTEM</h2>
          <p className="text-lg mb-4">
            Built with <span className="text-secondary font-bold">Arbitrum Stylus</span> (Rust smart contracts) for next-generation autonomous agent economies.
          </p>
          <p className="text-base text-muted-foreground">
            This demo showcases how AI agents, bots, and APIs can autonomously request services, pay instantly onchain, and split costs—all without human intervention. Live on Arbitrum Sepolia testnet.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-card p-6 text-center">
          <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-black text-lg mb-2">RUST CONTRACTS</h3>
          <p className="text-sm text-muted-foreground">Built with Arbitrum Stylus for performance & safety</p>
        </div>

        <div className="neo-card p-6 text-center">
          <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-black text-lg mb-2">x402 PROTOCOL</h3>
          <p className="text-sm text-muted-foreground">HTTP 402 Payment Required for bot-to-API settlement</p>
        </div>

        <div className="neo-card p-6 text-center">
          <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-black text-lg mb-2">TRUSTLESS</h3>
          <p className="text-sm text-muted-foreground">Smart contract escrow, no intermediaries needed</p>
        </div>

        <div className="neo-card p-6 text-center">
          <div className="bg-hot-fuchsia rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-black text-lg mb-2">PRODUCTION READY</h3>
          <p className="text-sm text-muted-foreground">Live contracts on Arbitrum, ready to scale</p>
        </div>
      </div>

      <div className="neo-card p-6">
        <h3 className="text-2xl font-black mb-4">🏆 FOR JUDGES</h3>
        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-secondary pl-4">
            <strong className="text-base">What We Built:</strong>
            <p className="mt-1">A complete payment infrastructure for autonomous agent economies, featuring payment routing with escrow, cost splitting for multi-agent collaborations, and x402 protocol integration for API micropayments.</p>
          </div>
          
          <div className="border-l-4 border-accent pl-4">
            <strong className="text-base">Technical Stack:</strong>
            <p className="mt-1">Arbitrum Stylus (Rust smart contracts), React + wagmi + RainbowKit frontend, deployed on Arbitrum Sepolia with full Arbiscan verification.</p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <strong className="text-base">Innovation:</strong>
            <p className="mt-1">First truly autonomous bot-to-bot payment system using Stylus. Agents can deposit funds, authorize other agents, initiate payments, and settle bills without any human interaction—all transparent and auditable onchain.</p>
          </div>

          <div className="border-l-4 border-hot-fuchsia pl-4">
            <strong className="text-base">Use Cases:</strong>
            <p className="mt-1">AI agents paying for API access (weather, data, compute), bot swarms splitting infrastructure costs, autonomous service marketplaces, and machine-to-machine commerce.</p>
          </div>
        </div>
      </div>

      <div className="neo-card p-6 gradient-sunset">
        <div className="bg-background/95 backdrop-blur p-4 border-2 border-foreground">
          <h4 className="font-black mb-3 text-lg">📚 KEY CONTRACTS</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>PaymentRouter:</strong> Handles deposits, agent authorization, payment initiation/completion, and withdrawals with fee management.
            </div>
            <div>
              <strong>CostSplitter:</strong> Creates multi-participant agreements, tracks contributions, and auto-settles when threshold is reached.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
