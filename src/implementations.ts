import { v4 as uuidv4 } from 'uuid';

class AccountImpl implements Account {
    accountId: string;
    user: User;
    bank: Bank;
    balance_left: number;

    constructor(user: User, bank: Bank, balance_left: number) {
        this.accountId = uuidv4();
        this.user = user;
        this.bank = bank;
        this.balance_left = balance_left;
    }

    credit(amount: number): boolean {
        if (amount<= 0) {
            console.log("No creditable amount");
            return false;
        }
        else {
            this.balance_left += amount;
            console.log(`${amount} credited to account ${this.accountId}. New balance: ${this.balance_left}`);
            return true;
        }
    }

    debit(amount: number): boolean {
        
        if (amount < 0) {
            console.log("Debiting nothing or less is against the company policy. Zzz try again.")
            return false;
        }

        if (this.bank.allowNegativeBalance) {
            this.balance_left -= amount;
            console.log(`${amount} debited from account ${this.accountId}. New balance: ${this.balance_left}`);
            return true;
        }
        else {
            if (amount > this.balance_left) {
                console.log("Insufficient funds in bank. Check bank details and/or add more funds to the account to proceed.");
                return false;
            }
            this.balance_left -= amount;
            console.log(`${amount} debited from account ${this.accountId}. New balance: ${this.balance_left}`);
            return true;

        }
    }
    
}


class BankImpl implements Bank {
    bankId: string;
    name: string;
    allowNegativeBalance: boolean;
    accounts: Account[];
    constructor(name: string, allowNegativeBalance: boolean = false) {
        this.bankId = uuidv4();
        this.name = name;
        this.allowNegativeBalance = allowNegativeBalance;
        this.accounts = [];
        console.log(`Bank "${this.name}" created with allowNegativeBalance=${this.allowNegativeBalance}.`);
    }

    addAccount(account: Account): boolean {
        this.accounts.push(account);
        console.log(`${account} added to the ${this.name} bank.`);
        return true;
    }
    findAccountBy(accountId: string): Account | null {
        for (let index = 0; index < this.accounts.length; index++) {
            if (this.accounts[index].accountId == accountId) {
                return this.accounts[index];
            }
        }
        return null;
    }
    
}

class UserImpl implements User {
    userId: string;
    name: string;
    accounts: Account[];

    constructor(name: string) {
        this.userId = uuidv4();
        this.name = name;
        this.accounts = [];
        console.log(`User "${this.name}" created with ID ${this.userId}.`);
    }

    addAccount(account: Account): void {
       this.accounts.push(account);
        console.log(`Account ${account.accountId} assigned to user ${this.name}.`);
    }
    findAccountBy(accountId: string): Account | null {
        for (let index = 0; index < this.accounts.length; index++) {
            if (this.accounts[index].accountId == accountId) {
                return this.accounts[index];
            }
        }
        return null;
    }
    
    getAccountsInBank(bankId: string): Account[] {
        return this.accounts.filter(account => account.bank.bankId === bankId);
    }

    
}


class SystemImpl implements System {
    banks: Bank[];
    users: User[];
    constructor() {
        this.banks = [];
        this.users = [];
        console.log("Banking system begins!");
    }

    createUser(name: string): User {
        const user = new UserImpl(name);
        this.users.push(user);
        return user;
    }
    createBank(name: string, allowNegativeBalance: boolean): Bank {
        const bank = new BankImpl(name, allowNegativeBalance);
        this.banks.push(bank);
        return bank;
    }
    createAccount(user: User, bank: Bank, initialBalance: number): Account {
        const account = new AccountImpl(user, bank, initialBalance);
        bank.addAccount(account);
        user.addAccount(account);
        return account;
    }
    findAccountById(accountId: string): Account | null {
            for (let bank of this.banks) {
                for (let index = 0; index < bank.accounts.length; index++) {
                if (bank.accounts[index].accountId == accountId) {
                    return bank.accounts[index];
                }
            }
            return null;
        }
    }

    transferMoney(fromAccountId: string, toAccountId: string, amount: number): boolean {
        console.log(`\nAttempting to transfer ${amount} from account ${fromAccountId} to account ${toAccountId}...`);

        const fromAccount = this.findAccountById(fromAccountId);
        const toAccount = this.findAccountById(toAccountId);

        if (!fromAccount) {
            console.error(`Sender account ${fromAccountId} not found. Zzz`);
            return false;
        }

        if (!toAccount) {
            console.error(`Recipient account ${toAccountId} not found. ZzZ`);
            return false;
        }

        if (amount <= 0) {
            console.error("Amount must be positive. Bzz");
            return false;
        }

        let actualSenderAccount: Account = fromAccount;

        if (fromAccount.bank.bankId === toAccount.bank.bankId) {
            console.log("Transfer is within the same bank.");

            if (!fromAccount.debit(amount)) {
                console.warn(`Insufficient funds in primary account ${fromAccount.accountId}. Checking other accounts for user ${fromAccount.user.name} in bank ${fromAccount.bank.name}.`);

                const userAccountsInSameBank = fromAccount.user.getAccountsInBank(fromAccount.bank.bankId);
                const potentialFallbackAccounts = userAccountsInSameBank
                    .filter(account => account.accountId !== fromAccountId)
                    .sort((a, b) => {
                        return b.balance_left - a.balance_left;
                    });


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
                    console.error(`Insufficient funds in all of the available accounts for user ${fromAccount.user.name} in bank ${fromAccount.bank.name}.`);
                    return false;
                }
            }
        } else {
            console.log(`Transfer is between different banks: ${fromAccount.bank.name} to ${toAccount.bank.name}.`);

            if (!fromAccount.debit(amount)) {
                console.error(`Insufficient funds in account ${fromAccount.accountId} for external transfer.`);
                return false;
            }
         }
        toAccount.credit(amount);
        console.log("Transfer completed successfully!");
        return true;
    }
}