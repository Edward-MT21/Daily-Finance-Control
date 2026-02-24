import { Routes } from '@angular/router';
import { TransactionRecord } from './components/transaction-record/transaction-record';
import { TransactionList } from './components/transaction-list/transaction-list';
import { CategorySummary } from './components/category-summary/category-summary';
import { FinancialCharts } from './components/financial-charts/financial-charts';
import { authGuard } from './guards/auth.guard';
import { Login } from './components/login/login';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'transaction-record', component: TransactionRecord, canActivate: [authGuard] },
    { path: 'transaction-list', component: TransactionList, canActivate: [authGuard] },
    { path: 'category-summary', component: CategorySummary, canActivate: [authGuard] },
    { path: 'financial-charts', component: FinancialCharts, canActivate: [authGuard] },
    { path: '', redirectTo: '/transaction-record', pathMatch: 'full' }
];
