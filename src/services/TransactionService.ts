// services/TransactionService.ts

import { getAllAccounts, BankAccount } from '../models/bank-account';
import { getAllUsers, User } from '../models/user';
import { getAllBanks, Bank } from '../models/bank';

export interface ITransactionService {
    transfer(fromAccountId: string, toAccountId: string, amount: number): boolean;
}

export class TransactionService implements ITransactionService {

    constructor() {
       console.log("TransactionService initialized.");
    }

    transfer(fromAccountId: string, toAccountId: string, amount: number): boolean {
        console.log(`\nAttempting to transfer ${amount} from account ${fromAccountId} to account ${toAccountId}...`);

        const allAccounts = getAllAccounts();
        let fromAccount: BankAccount | undefined;
        let toAccount: BankAccount | undefined;

        for (let index = 0; index < allAccounts.length; index++) {
            if (allAccounts[index].accountId == fromAccountId) {
            fromAccount = allAccounts[index];
            }
            if (allAccounts[index].accountId == toAccountId) {
            toAccount = allAccounts[index];
            }
            
        }


        if (!fromAccount) {
            console.error(`Transfer failed: Sender account ${fromAccountId} not found.`);
            return false;
        }

        if (!toAccount) {
            console.error(`Transfer failed: Recipient account ${toAccountId} not found.`);
            return false;
        }

        if (amount <= 0) {
            console.error("Transfer failed: Amount must be positive.");
            return false;
        }

        const senderUser = fromAccount._getUser();
        const senderBank = fromAccount._getBank();

         if (!senderUser || !senderBank) {
             console.error(`Transfer failed: Sender account ${fromAccountId} is not fully linked to a user or bank.`);
             return false;
         }


        let actualSenderAccount: BankAccount = fromAccount;

        if (fromAccount._getBank().bankId === toAccount._getBank().bankId) {
            console.log("Transfer is within the same bank.");

            if (!fromAccount.debit(amount)) {
                console.warn(`Insufficient funds in primary account ${fromAccount.accountId}. Checking other accounts for user ${senderUser.name} in bank ${senderBank.name}.`);

                 const userAccountsInSameBank = senderUser._getAccounts().filter(acc => acc._getBank().bankId === senderBank.bankId);
                const potentialFallbackAccounts = userAccountsInSameBank
                    .filter(account => account.accountId !== fromAccountId)
                    .sort((a, b) => b.getBalance() - a.getBalance());


                let fallbackSuccess = false;
                for (const fallbackAccount of potentialFallbackAccounts) {
                    console.log(`Attempting debit from fallback account ${fallbackAccount.accountId}...`);
                    if (fallbackAccount.debit(amount)) {
                        actualSenderAccount = fallbackAccount;
                        fallbackSuccess = true;
                        console.log(`Debit successful from fallback account ${fallbackAccount.accountId}.`);
                        break; 
                    }
                }

                if (!fallbackSuccess) {
                    console.error(`Transfer failed: Insufficient funds in all available accounts for user ${senderUser.name} in bank ${senderBank.name}.`);
                    return false;
                }
            }
} else {
            console.log(`Transfer is between different banks: ${senderBank.name} to ${toAccount._getBank().name}.`);

            if (!fromAccount.debit(amount)) {
                console.error(`Transfer failed: Insufficient funds in sender account ${fromAccount.accountId} for external transfer.`);
                return false;
            }
        }

        toAccount.credit(amount);
        console.log("Transfer completed successfully.");
        return true;
    }
}
export default TransactionService;