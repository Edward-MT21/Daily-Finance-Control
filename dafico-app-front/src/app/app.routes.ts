import { Routes } from '@angular/router';
import { TransactionRecord } from './components/transaction-record/transaction-record';
import { TransactionList } from './components/transaction-list/transaction-list';
import { CategorySummary } from './components/category-summary/category-summary';
import { FinancialCharts } from './components/financial-charts/financial-charts';

export const routes: Routes = [
    { path: 'transaction-record', component: TransactionRecord },
    { path: 'transaction-list', component: TransactionList },
    { path: 'category-summary', component: CategorySummary },
    { path: 'financial-charts', component: FinancialCharts },
    { path: '', redirectTo: '/record', pathMatch: 'full' }
];
