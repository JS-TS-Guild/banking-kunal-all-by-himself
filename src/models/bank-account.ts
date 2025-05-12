import { Bank } from './bank';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

export interface BankAccount {
    accountId: string;
    user: User;
    bank: Bank;
    balance_left: number;
    credit(amount: number): boolean;
    debit(amount: number): boolean;
    _getUser(): User;
    _getBank(): Bank;
    _setUser(user: any): void;
    _setBank(bank: any): void;
    getBalance(): number;
}

const accountsStore: BankAccount[] = [];

export function getAllAccounts(): BankAccount[] {
        return accountsStore;
    }
class AccountImpl implements BankAccount {
    accountId: string;
    user: User;
    bank: Bank;
    balance_left: number;

    constructor(user: User, bank: Bank, balance_left: number) {
        this.accountId = uuidv4();
        this.user = user;
        this.bank = bank;
        this.balance_left = balance_left;
        accountsStore.push(this);

    }
    _getUser(): User {
        return this.user;
    }
    _getBank(): Bank {
        return this.bank;
    }
    _setUser(user: any): void {
        this.user = user;
    }
    _setBank(bank: any): void {
        this.bank = bank;
    }
    getBalance(): number {
        return this.balance_left;
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
