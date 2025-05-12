interface Account {
    accountId: string;
    user: User;
    bank: Bank;
    balance_left: number;
    credit(amount: number): boolean;
    debit(amount: number): boolean;
}

interface User {
    userId: string;
    name: string; 
    accounts: Account[];
    addAccount(account: Account): void;
    findAccountBy(accountId: string): Account | undefined;
    getAccountsInBank(bankId: string): Account[]
}

interface Bank {
    bankId: string;
    name: string;
    allowNegativeBalance: boolean;
    accounts: Account[];
    addAccount(account: Account) : boolean;
    findAccountBy(accountId: string): void;

}

interface System { 
    banks: Bank[];
    users: User[];
    createUser(name: string): User;
    createBank(name: string, allowNegativeBalance: boolean): Bank;
    createAccount(user: User, bank: Bank, initialBalance: number): Account;
    transferMoney(fromAccount: string, toAccount: string, amount: number): boolean;
}