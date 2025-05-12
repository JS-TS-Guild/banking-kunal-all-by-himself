import { Bank } from './bank';
import { BankAccount } from './bank-account';
import { v4 as uuidv4 } from 'uuid';

export interface User {
    userId: string;
    name: string; 
    accounts: BankAccount[];
    addAccount(account: BankAccount): void;
    findAccountBy(accountId: string): BankAccount | null;
    getAccountsInBank(bankId: string): BankAccount[];
    _getId(): string;
    _getName(): string;
    _getAccounts(): BankAccount[];
    _setAccounts(accounts: BankAccount[]): void;
    _setName(name: string): void;
}

const usersStore: User[] = [];
export function getAllUsers(): User[] {
    return usersStore;
}

class UserImpl implements User {
    userId: string;
    name: string;
    accounts: BankAccount[];

    constructor(name: string) {
        this.userId = uuidv4();
        this.name = name;
        this.accounts = [];
        console.log(`User "${this.name}" created with ID ${this.userId}.`);
        usersStore.push(this);
    }

    
    getId(): string {
        return this.userId;
    }
    getName(): string {
        return this.name;
    }
    getAccounts(): BankAccount[] {
        return this.accounts;
    }
    setAccounts(accounts: BankAccount[]): void {
        this.accounts = accounts;
    }
    setName(name: string): void {
        this.name = name;
    }
    
    _getId(): string {
        throw new Error('Method not implemented.');
        }
    _getName(): string {
        throw new Error('Method not implemented.');
    }
    _getAccounts(): BankAccount[] {
        throw new Error('Method not implemented.');
    }
    _setAccounts(accounts: BankAccount[]): void {
        throw new Error('Method not implemented.');
    }
    _setName(name: string): void {
        throw new Error('Method not implemented.');
    }
    

    

    addAccount(account: BankAccount): void {
       this.accounts.push(account);
        console.log(`Account ${account.accountId} assigned to user ${this.name}.`);
    }
    findAccountBy(accountId: string): BankAccount | null {
        for (let index = 0; index < this.accounts.length; index++) {
            if (this.accounts[index].accountId == accountId) {
                return this.accounts[index];
            }
        }
        return null;
    }
    
    getAccountsInBank(bankId: string): BankAccount[] {
        return this.accounts.filter(account => account.bank.bankId === bankId);
    }

    
}