import { Routes } from '@angular/router';
import { TransactionRecord } from './components/transaction-record/transaction-record';
import { TransactionList } from './components/transaction-list/transaction-list';

export const routes: Routes = [
    { path: 'record', component: TransactionRecord },
    { path: 'list', component: TransactionList },
    { path: '', redirectTo: '/record', pathMatch: 'full' }
];
