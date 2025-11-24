# AgentSwarm Payment System

**Smart, autonomous payments and cost splitting for bots, APIs, and teams powered by Arbitrum Stylus.**  
Live demo, event logs, and a system you can actually run—see architecture, addresses, and all instructions below.

***

### Deployed Site Link

- [x] **Working Demo Site** [https://agentswarm.netlify.app/]

***

## 🚦 Problem → Solution → Demo Steps

### Problem  
Bots and APIs can browse, analyze, and collaborate—**but they can't actually pay, split bills, or settle transactions on-chain, autonomously.** Old payment systems require manual steps, centralized control, or off-chain reconciliation.

### Solution  
AgentSwarm enables:
- On-chain, autonomous payments between agents (bots and humans).
- Group cost splits for API usage, team SaaS, or bot cooperation—all fully settled on Arbitrum.
- Transparent event logs, instant explorer verification.
- Modern frontend (React + wagmi + ethers.js) with bot simulation and live event feedback.

### Demo Steps  
1. **Connect wallet** (MetaMask, Wagmi, user or bot).
2. **Deposit** funds or simulate bot payments using Payment Router Dashboard.
3. **Create/Contribute to cost splits** with Cost Splitter Dashboard or Bot Simulation Tab (3 demo bots: Satoshi, Alex, Priya).
4. **Track live events** in the Event Log Panel, verify each on-chain transaction in Arbiscan.

***

## 💡 System Architecture

See the diagram below for full clarity:


![WhatsApp Image 2025-11-24 at 15 56 43](https://github.com/user-attachments/assets/c39745ce-fc97-4bc5-a5b3-4e01479e4477)


- Multiple agents (simulated bots + human user) connect with a wallet to the frontend.
- Each module (Payment Router, Cost Splitter, Bot Simulation) interacts with its respective contract (live addresses).
- All contract events are parsed and shown in the Event Log Panel.
- Persistent logs and on-chain actions are instantly verifiable on Arbiscan.

***

## 🚀 Deployed Contract Info

| Contract          | Address                                                                | Explorer Link                                              |
|-------------------|------------------------------------------------------------------------|------------------------------------------------------------|
| Payment Router    | 0x64c967a9c70ec3c9522c722aa83810b039baae0d                             | [Arbiscan](https://sepolia.arbiscan.io/address/0x64c967a9c70ec3c9522c722aa83810b039baae0d)   |
| Cost Splitter     | 0x961e2a92c7007ffdc8c76a5f5c8bcb824b03f7b2                             | [Arbiscan](https://sepolia.arbiscan.io/address/0x961e2a92c7007ffdc8c76a5f5c8bcb824b03f7b2)   |

***

## 📹 Demo Video (≤90s)

(https://youtube.com/@akamysteryeditor4736?si=RrEAmimzlv38LPLo)

***

## 🏆 Demo Day Flow (3-Minute Plan)

- **Hook (20s):**  
  "Today, bots and APIs can't autonomously pay or split bills on-chain. AgentSwarm brings settlement, cost split, and real agent commerce natively on Arbitrum Stylus."
- **Live Flow (90s):**  
  - Connect wallet (bot or user) in the app.
  - Deposit ETH, trigger payment, show cost split with 3 bots (Satoshi, Alex, Priya).
  - Display instant event logs, explorer links.
- **Why Arbitrum (30s):**  
  - "Stylus lets us run Rust-powered contracts at ultra-low gas, with rich modular logic, and far more scale and throughput than classic Solidity."
- **Credible Next Steps (30s):**  
  - "Next: mainnet integration, AI plug-ins, SaaS team adoption. We're seeking mentors, grants, and real-world partners for the autonomous agent economy."

***

## 📦 Project Directories

- `/abi/paymentRouter.abi.json` & `/abi/costSplitter.abi.json` — pure contract ABIs
- `/frontend` — UI demo app (React + ethers.js + wagmi)
- `/docs` — architecture diagrams, live contract info, design choices

***

## 📝 Additional Resources

- Faucets for Arbitrum Sepolia test ETH: [Alchemy Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
- Frontend setup and usage guide: See `/frontend/README.md`
- Technical manual & bot simulation usage: See `/docs/USAGE.md`

***
