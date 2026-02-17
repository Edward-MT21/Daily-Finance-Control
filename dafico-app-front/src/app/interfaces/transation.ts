interface Transaction {
    id: number
    type: string // "INCOME" o "EGRESS"
    date: string
    value: number
}