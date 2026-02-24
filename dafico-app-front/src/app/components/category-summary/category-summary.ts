import { Component, computed, inject, NgModule, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-category-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-summary.html',
  styleUrl: './category-summary.css',
})
export class CategorySummary {
  private transactionService = inject(TransactionService);

  allTransactions = signal<any[]>([]);

  masterDataService = inject(MasterDataService);
  categories = this.masterDataService.categories;

  // Mes seleccionado (por defecto el mes actual)
  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(new Date().getFullYear()); // Nueva señal para el año

  years = this.masterDataService.years;

  months = [
    { value: 0, name: 'January' }, { value: 1, name: 'February' },
    { value: 2, name: 'March' }, { value: 3, name: 'April' },
    { value: 4, name: 'May' }, { value: 5, name: 'June' },
    { value: 6, name: 'July' }, { value: 7, name: 'August' },
    { value: 8, name: 'September' }, { value: 9, name: 'October' },
    { value: 10, name: 'November' }, { value: 11, name: 'December' }
  ];

  constructor() {
    this.transactionService.findAll().subscribe(data => this.allTransactions.set(data));
  }

  // Modificamos el filtro para que use MES y AÑO
  filteredByMonth = computed(() => {
    return this.allTransactions().filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === this.selectedMonth() &&
        transactionDate.getFullYear() === this.selectedYear();
    });
  });

  // Agrupamos los datos filtrados por categoría
  summaryData = computed(() => {
    const transactions = this.filteredByMonth();
    return this.categories().map(cat => {
      const catTrans = transactions.filter(t => t.category === cat);
      const income = catTrans.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.value, 0);
      const egress = catTrans.filter(t => t.type === 'EGRESS').reduce((acc, t) => acc + t.value, 0);
      return { name: cat, income, egress, balance: income - egress };
    });
  });

  totals = computed(() => {
    const data = this.summaryData();
    return {
      income: data.reduce((acc, d) => acc + d.income, 0),
      egress: data.reduce((acc, d) => acc + d.egress, 0),
      balance: data.reduce((acc, d) => acc + d.balance, 0)
    };
  });

  onMonthChange(event: any) {
    this.selectedMonth.set(Number(event.target.value));
  }

  onYearChange(event: any) {
    this.selectedYear.set(Number(event.target.value));
  }

}
