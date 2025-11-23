#![allow(deprecated)]
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256, FixedBytes},
    alloy_sol_types::{sol, SolError},
    prelude::*,
    msg, block, evm,
};
use alloc::vec::Vec;

sol_storage! {
    #[entrypoint]
    pub struct CostSplitter {
        address payment_router;
        mapping(bytes32 => SplitAgreement) agreements;
        mapping(bytes32 => mapping(address => bool)) has_paid;
        mapping(bytes32 => mapping(address => uint256)) contributions;
        uint256 agreement_count;
    }

    pub struct SplitAgreement {
        bytes32 id;
        uint256 participant_count;
        uint256 total_amount;
        address payee;
        uint256 collected;
        bool completed;
        uint256 timestamp;
        uint256 share_per_participant;
    }
}

sol! {
    event AgreementCreated(bytes32 indexed agreement_id, uint256 total_amount, address payee, uint256 participants);
    event ContributionMade(bytes32 indexed agreement_id, address indexed participant, uint256 amount);
    event AgreementCompleted(bytes32 indexed agreement_id, uint256 total_collected);

    error AgreementNotFound();
    error AlreadyPaid();
    error AgreementAlreadyCompleted();
    error InsufficientContribution();
    error InvalidParameters();
}

#[public]
impl CostSplitter {
    /// Initialize contract
    pub fn init(&mut self, payment_router: Address) -> Result<(), Vec<u8>> {
        self.payment_router.set(payment_router);
        self.agreement_count.set(U256::ZERO);
        Ok(())
    }

    /// Create a cost-splitting agreement
    pub fn create_agreement(
        &mut self,
        participant_count: U256,
        total_amount: U256,
        payee: Address,
    ) -> Result<[u8; 32], Vec<u8>> {
        if participant_count == U256::ZERO || total_amount == U256::ZERO {
            return Err(InvalidParameters {}.abi_encode());
        }

        let count = self.agreement_count.get();
        let agreement_id = Self::hash_agreement_id(count);

        let share = total_amount / participant_count;

        let mut agreement = self.agreements.setter(FixedBytes::<32>::from(agreement_id));
        agreement.id.set(FixedBytes::<32>::from(agreement_id));
        agreement.participant_count.set(participant_count);
        agreement.total_amount.set(total_amount);
        agreement.payee.set(payee);
        agreement.collected.set(U256::ZERO);
        agreement.completed.set(false);
        agreement.timestamp.set(U256::from(block::timestamp()));
        agreement.share_per_participant.set(share);

        self.agreement_count.set(count + U256::from(1));

        evm::log(AgreementCreated {
            agreement_id: FixedBytes::<32>::from(agreement_id),
            total_amount,
            payee,
            participants: participant_count,
        });

        Ok(agreement_id)
    }

    /// Contribute to a split agreement
    #[payable]
    pub fn contribute(&mut self, agreement_id: [u8; 32]) -> Result<(), Vec<u8>> {
        let agreement_id_fixed = FixedBytes::<32>::from(agreement_id);
        
        // First, get all the values we need from the agreement
        let agreement = self.agreements.get(agreement_id_fixed);
        
        if agreement.payee.get() == Address::ZERO {
            return Err(AgreementNotFound {}.abi_encode());
        }

        if agreement.completed.get() {
            return Err(AgreementAlreadyCompleted {}.abi_encode());
        }

        let sender = msg::sender();
        let amount = msg::value();
        
        if self.has_paid.getter(agreement_id_fixed).get(sender) {
            return Err(AlreadyPaid {}.abi_encode());
        }

        let share_per_participant = agreement.share_per_participant.get();
        if amount < share_per_participant {
            return Err(InsufficientContribution {}.abi_encode());
        }

        // Store all values we'll need later
        let old_collected = agreement.collected.get();
        let total_amount = agreement.total_amount.get();
        let payee_address = agreement.payee.get();
        
        // Drop the immutable borrow by dropping the agreement variable
        drop(agreement);

        // Now we can do mutable operations
        self.has_paid.setter(agreement_id_fixed).setter(sender).set(true);
        self.contributions.setter(agreement_id_fixed).setter(sender).set(amount);

        let collected = old_collected + amount;
        self.agreements.setter(agreement_id_fixed).collected.set(collected);

        evm::log(ContributionMade {
            agreement_id: agreement_id_fixed,
            participant: sender,
            amount,
        });

        if collected >= total_amount {
            self.agreements.setter(agreement_id_fixed).completed.set(true);
            self.vm().transfer_eth(payee_address, collected)?;

            evm::log(AgreementCompleted {
                agreement_id: agreement_id_fixed,
                total_collected: collected,
            });
        }

        Ok(())
    }

    /// Get agreement details
    pub fn get_agreement(&self, agreement_id: [u8; 32]) -> (U256, Address, U256, bool, U256, U256) {
        let agreement = self.agreements.get(FixedBytes::<32>::from(agreement_id));
        (
            agreement.total_amount.get(),
            agreement.payee.get(),
            agreement.collected.get(),
            agreement.completed.get(),
            agreement.participant_count.get(),
            agreement.share_per_participant.get(),
        )
    }

    /// Check if participant has paid
    pub fn has_participant_paid(&self, agreement_id: [u8; 32], participant: Address) -> bool {
        self.has_paid.getter(FixedBytes::<32>::from(agreement_id)).get(participant)
    }

    /// Get participant's contribution
    pub fn get_contribution(&self, agreement_id: [u8; 32], participant: Address) -> U256 {
        self.contributions.getter(FixedBytes::<32>::from(agreement_id)).get(participant)
    }

    /// Get total number of agreements
    pub fn get_agreement_count(&self) -> U256 {
        self.agreement_count.get()
    }

    /// Internal: Hash agreement ID
    fn hash_agreement_id(count: U256) -> [u8; 32] {
        use tiny_keccak::{Hasher, Keccak};
        let mut hasher = Keccak::v256();
        let mut output = [0u8; 32];
        hasher.update(&count.to_be_bytes::<32>());
        hasher.finalize(&mut output);
        output
    }
}