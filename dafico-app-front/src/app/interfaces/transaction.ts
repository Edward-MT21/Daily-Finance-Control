interface Transaction {
    id: number;
    type: string; // "INCOME" o "EGRESS"
    category: string;
    date: string;
    value: number;
    description: string;

}