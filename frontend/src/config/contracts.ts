export const PAYMENT_ROUTER_ADDRESS = '0x64c967a9c70ec3c9522c722aa83810b039baae0d' as const;
export const COST_SPLITTER_ADDRESS = '0x961e2a92c7007ffdc8c76a5f5c8bcb824b03f7b2' as const;

export const PAYMENT_ROUTER_ABI = [
  {
    type: "function",
    name: "init",
    stateMutability: "nonpayable",
    inputs: [{ name: "fee_percentage", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "authorizeAgent",
    stateMutability: "nonpayable",
    inputs: [{ name: "agent", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "revokeAgent",
    stateMutability: "nonpayable",
    inputs: [{ name: "agent", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "initiatePayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "payee", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bytes32" }]
  },
  {
    type: "function",
    name: "completePayment",
    stateMutability: "nonpayable",
    inputs: [{ name: "payment_id", type: "bytes32" }],
    outputs: []
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getBalance",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "isAuthorized",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "getPayment",
    stateMutability: "view",
    inputs: [{ name: "payment_id", type: "bytes32" }],
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "getPaymentCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getFeePercentage",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "hashId",
    stateMutability: "pure",
    inputs: [{ name: "count", type: "uint256" }],
    outputs: [{ name: "", type: "bytes32" }]
  }
] as const;

export const COST_SPLITTER_ABI = [
  {
    type: "function",
    name: "init",
    stateMutability: "nonpayable",
    inputs: [{ name: "payment_router", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "createAgreement",
    stateMutability: "nonpayable",
    inputs: [
      { name: "participant_count", type: "uint256" },
      { name: "total_amount", type: "uint256" },
      { name: "payee", type: "address" }
    ],
    outputs: [{ name: "", type: "bytes32" }]
  },
  {
    type: "function",
    name: "contribute",
    stateMutability: "payable",
    inputs: [{ name: "agreement_id", type: "bytes32" }],
    outputs: []
  },
  {
    type: "function",
    name: "getAgreement",
    stateMutability: "view",
    inputs: [{ name: "agreement_id", type: "bytes32" }],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "hasParticipantPaid",
    stateMutability: "view",
    inputs: [
      { name: "agreement_id", type: "bytes32" },
      { name: "participant", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "getContribution",
    stateMutability: "view",
    inputs: [
      { name: "agreement_id", type: "bytes32" },
      { name: "participant", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getAgreementCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "hashAgreementId",
    stateMutability: "pure",
    inputs: [{ name: "count", type: "uint256" }],
    outputs: [{ name: "", type: "bytes32" }]
  }
] as const;

export const ARBITRUM_SEPOLIA_CHAIN = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
  testnet: true,
} as const;
