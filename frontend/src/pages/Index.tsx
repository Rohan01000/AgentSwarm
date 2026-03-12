import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletButton } from '@/components/WalletButton';
import { EventLog, LogEntry } from '@/components/EventLog';
import { BotAPIDemo } from '@/components/BotAPIDemo';
import { PaymentRouterDemo } from '@/components/PaymentRouterDemo';
import { CostSplitterDemo } from '@/components/CostSplitterDemo';
import { AboutSection } from '@/components/AboutSection';
import { config } from '@/config/wagmi';
import { Bot, Wallet, Users, Info, Zap } from 'lucide-react';
import { ContractAddress } from '@/components/ContractAddress';
import { PAYMENT_ROUTER_ADDRESS, COST_SPLITTER_ADDRESS } from '@/config/contracts';

const queryClient = new QueryClient();

const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (log: LogEntry) => {
    setLogs(prev => [log, ...prev].slice(0, 50));
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: 'hsl(340, 100%, 50%)', borderRadius: 'none' })}>
          <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b-4 border-foreground py-5 px-4 md:px-8 gradient-electric">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Zap className="h-8 w-8 text-amber-gold" />
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                      AGENTSWARM
                    </h1>
                  </div>
                  <p className="text-sm md:text-base font-bold text-white/80 mt-1">
                    Autonomous Payment Infrastructure on Arbitrum Stylus
                  </p>
                </div>
                <WalletButton />
              </div>
            </header>

            {/* Contract Addresses */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-0">
              <div className="grid md:grid-cols-2 gap-4 py-4">
                <ContractAddress address={PAYMENT_ROUTER_ADDRESS} label="Payment Router" variant="primary" />
                <ContractAddress address={COST_SPLITTER_ADDRESS} label="Cost Splitter" variant="secondary" />
              </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
              <Tabs defaultValue="demo" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 p-1 border-4 border-foreground bg-muted h-auto">
                  <TabsTrigger
                    value="demo"
                    className="neo-border-sm data-[state=active]:gradient-electric data-[state=active]:text-white font-black py-3 text-xs sm:text-sm"
                  >
                    <Bot className="mr-1.5 h-4 w-4" />
                    <span className="hidden sm:inline">BOT </span>DEMO
                  </TabsTrigger>
                  <TabsTrigger
                    value="router"
                    className="neo-border-sm data-[state=active]:gradient-fire data-[state=active]:text-white font-black py-3 text-xs sm:text-sm"
                  >
                    <Wallet className="mr-1.5 h-4 w-4" />
                    <span className="hidden sm:inline">PAYMENT </span>ROUTER
                  </TabsTrigger>
                  <TabsTrigger
                    value="splitter"
                    className="neo-border-sm data-[state=active]:gradient-sunset data-[state=active]:text-white font-black py-3 text-xs sm:text-sm"
                  >
                    <Users className="mr-1.5 h-4 w-4" />
                    <span className="hidden sm:inline">COST </span>SPLIT
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="neo-border-sm data-[state=active]:bg-foreground data-[state=active]:text-background font-black py-3 text-xs sm:text-sm"
                  >
                    <Info className="mr-1.5 h-4 w-4" />
                    ABOUT
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-6">
                  <BotAPIDemo onLog={addLog} />
                </TabsContent>

                <TabsContent value="router" className="space-y-6">
                  <PaymentRouterDemo onLog={addLog} />
                </TabsContent>

                <TabsContent value="splitter" className="space-y-6">
                  <CostSplitterDemo onLog={addLog} />
                </TabsContent>

                <TabsContent value="about">
                  <AboutSection />
                </TabsContent>
              </Tabs>

              {/* Event Log - Always visible */}
              <div className="mt-8">
                <EventLog logs={logs} />
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t-4 border-foreground py-6 px-4 md:px-8 gradient-full">
              <div className="max-w-7xl mx-auto text-center text-white">
                <p className="font-black text-lg mb-1">Built with Arbitrum Stylus (Rust) + React + wagmi</p>
                <p className="text-sm text-white/70">
                  Powering the future of autonomous agent economies • Arbitrum Sepolia Testnet
                </p>
              </div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Index;
