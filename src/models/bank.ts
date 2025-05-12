import { BankAccount } from './bank-account';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

export interface Bank {
    bankId: string;
    name: string;
    allowNegativeBalance: boolean;
    accounts: BankAccount[];
    addAccount(account: BankAccount) : boolean;
    findAccountBy(accountId: string): void;
    _getId(): string;
    _getName(): string;
    _getAllowNegativeBalance(): boolean;
    _getAccounts(): BankAccount[];
    _setAllowNegativeBalance(allowNegativeBalance: boolean): void;
    _setAccounts(accounts: BankAccount[]): void;
    _setName(name: string): void;
}

const banksStore: Bank[] = [];

export function getAllBanks(): Bank[] {
        return banksStore;
    }

class BankImpl implements Bank {
    bankId: string;
    name: string;
    allowNegativeBalance: boolean;
    accounts: BankAccount[];
    constructor(name: string, allowNegativeBalance: boolean = false) {
        this.bankId = uuidv4();
        this.name = name;
        this.allowNegativeBalance = allowNegativeBalance;
        this.accounts = [];
        console.log(`Bank "${this.name}" created with allowNegativeBalance=${this.allowNegativeBalance}.`);
        banksStore.push(this);
    }
    _getId(): string {
        throw new Error('Method not implemented.');
    }
    _getName(): string {
        throw new Error('Method not implemented.');
    }
    _getAllowNegativeBalance(): boolean {
        throw new Error('Method not implemented.');
    }
    _getAccounts(): BankAccount[] {
        throw new Error('Method not implemented.');
    }
    _setAllowNegativeBalance(allowNegativeBalance: boolean): void {
        throw new Error('Method not implemented.');
    }
    _setAccounts(accounts: BankAccount[]): void {
        throw new Error('Method not implemented.');
    }
    _setName(name: string): void {
        throw new Error('Method not implemented.');
    }

    getId(): string {
        return this.bankId;
    }
    getName(): string {
        return this.name;
    }
    getAllowNegativeBalance(): boolean {
        return this.allowNegativeBalance;
    }
    getAccounts(): BankAccount[] {
        return this.accounts;
    }
    setAllowNegativeBalance(allowNegativeBalance: boolean): void {
        this.allowNegativeBalance = allowNegativeBalance;
    }
    setAccounts(accounts: BankAccount[]): void {
        this.accounts = accounts;
    }
    setName(name: string): void {
        this.name = name;
    }
    

    addAccount(account: BankAccount): boolean {
        this.accounts.push(account);
        console.log(`${account} added to the ${this.name} bank.`);
        return true;
    }
    findAccountBy(accountId: string): BankAccount | null {
        for (let index = 0; index < this.accounts.length; index++) {
            if (this.accounts[index].accountId == accountId) {
                return this.accounts[index];
            }
        }
        return null;
    }
    
}