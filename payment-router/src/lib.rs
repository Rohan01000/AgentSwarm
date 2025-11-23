#![allow(deprecated)]
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256, FixedBytes},
    alloy_sol_types::{sol, SolError},
    prelude::*,
    msg, evm, block, call,
};

sol_storage! {
    #[entrypoint]
    pub struct PaymentRouter {
        address owner;
        mapping(address => uint256) balances;
        mapping(address => bool) authorized_agents;
        mapping(bytes32 => Payment) payments;
        uint256 payment_count;
        uint256 fee_percentage;
    }
    pub struct Payment {
        address payer;
        address payee;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
}

sol! {
    event PaymentInitiated(bytes32 payment_id, address payer, address payee, uint256 amount);
    event PaymentCompleted(bytes32 payment_id);
    event AgentAuthorized(address agent);
    event AgentRevoked(address agent);
    event Deposited(address user, uint256 amount);
    event Withdrawn(address user, uint256 amount);

    error Unauthorized();
    error InsufficientBalance();
    error PaymentNotFound();
    error PaymentAlreadyCompleted();
    error InvalidAmount();
}

#[public]
impl PaymentRouter {
    pub fn init(&mut self, fee_percentage: U256) -> Result<(), Vec<u8>> {
        self.owner.set(msg::sender());
        self.fee_percentage.set(fee_percentage);
        self.payment_count.set(U256::ZERO);
        Ok(())
    }

    pub fn authorize_agent(&mut self, agent: Address) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(Unauthorized {}.abi_encode());
        }
        self.authorized_agents.setter(agent).set(true);
        evm::log(AgentAuthorized { agent });
        Ok(())
    }

    pub fn revoke_agent(&mut self, agent: Address) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(Unauthorized {}.abi_encode());
        }
        self.authorized_agents.setter(agent).set(false);
        evm::log(AgentRevoked { agent });
        Ok(())
    }

    #[payable]
    pub fn deposit(&mut self) -> Result<(), Vec<u8>> {
        let amount = msg::value();
        if amount.is_zero() {
            return Err(InvalidAmount {}.abi_encode());
        }
        let sender = msg::sender();
        let old = self.balances.get(sender);
        self.balances.setter(sender).set(old + amount);
        evm::log(Deposited { user: sender, amount });
        Ok(())
    }

    pub fn initiate_payment(
        &mut self,
        payee: Address,
        amount: U256,
    ) -> Result<[u8; 32], Vec<u8>> {
        let payer = msg::sender();
        if !self.authorized_agents.get(payer) {
            return Err(Unauthorized {}.abi_encode());
        }
        let payer_balance = self.balances.get(payer);
        if payer_balance < amount {
            return Err(InsufficientBalance {}.abi_encode());
        }
        let payment_count = self.payment_count.get();
        let payment_id = Self::hash_id(payment_count);

        let mut payment = self.payments.setter(FixedBytes::<32>::from(payment_id));
        payment.payer.set(payer);
        payment.payee.set(payee);
        payment.amount.set(amount);
        payment.timestamp.set(U256::from(block::timestamp()));
        payment.completed.set(false);

        self.balances.setter(payer).set(payer_balance - amount);
        self.payment_count.set(payment_count + U256::ONE);

        evm::log(PaymentInitiated {
            payment_id: FixedBytes::<32>::from(payment_id),
            payer,
            payee,
            amount,
        });
        Ok(payment_id)
    }

    pub fn complete_payment(&mut self, payment_id: [u8; 32]) -> Result<(), Vec<u8>> {
        let id = FixedBytes::<32>::from(payment_id);
        let payment = self.payments.get(id);

        if payment.payer.get() == Address::ZERO {
            return Err(PaymentNotFound {}.abi_encode());
        }
        if payment.completed.get() {
            return Err(PaymentAlreadyCompleted {}.abi_encode());
        }
        if msg::sender() != payment.payee.get() {
            return Err(Unauthorized {}.abi_encode());
        }

        let fee = (payment.amount.get() * self.fee_percentage.get()) / U256::from(10000_u128);
        let payee_amount = payment.amount.get() - fee;

        let payee_address = payment.payee.get();
        let payee_balance = self.balances.get(payee_address);
        self.balances.setter(payee_address).set(payee_balance + payee_amount);
        self.payments.setter(id).completed.set(true);

        evm::log(PaymentCompleted { payment_id: id });
        Ok(())
    }

    pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        let balance = self.balances.get(sender);

        if balance < amount {
            return Err(InsufficientBalance {}.abi_encode());
        }
        self.balances.setter(sender).set(balance - amount);
        call::transfer_eth(sender, amount)?;
        evm::log(Withdrawn { user: sender, amount });
        Ok(())
    }

    // -------- Views --------
    pub fn get_balance(&self, agent: Address) -> U256 {
        self.balances.get(agent)
    }
    pub fn is_authorized(&self, agent: Address) -> bool {
        self.authorized_agents.get(agent)
    }
    pub fn get_payment(&self, payment_id: [u8; 32]) -> (Address, Address, U256, U256, bool) {
        let payment = self.payments.get(FixedBytes::<32>::from(payment_id));
        (
            payment.payer.get(),
            payment.payee.get(),
            payment.amount.get(),
            payment.timestamp.get(),
            payment.completed.get(),
        )
    }
    pub fn get_payment_count(&self) -> U256 {
        self.payment_count.get()
    }
    pub fn get_fee_percentage(&self) -> U256 {
        self.fee_percentage.get()
    }

    fn hash_id(count: U256) -> [u8; 32] {
        use tiny_keccak::{Hasher, Keccak};
        let mut hasher = Keccak::v256();
        let mut output = [0u8; 32];
        hasher.update(&count.to_be_bytes::<32>());
        hasher.finalize(&mut output);
        output
    }
}