import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CurrencyPipe } from '@angular/common';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-transaction-list',
  imports: [CurrencyPipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {

  private transactionService = inject(TransactionService);
  allTransactions = signal<Transaction[]>([]);

  // Signals for the filters
  filterType = signal<string>('ALL');
  filterCategory = signal<string>('ALL');
  startDate = signal<string>('');
  endDate = signal<string>('');

  masterDataService = inject(MasterDataService);

  categories = this.masterDataService.categories;

  ngOnInit() {
    this.setDefaultDates();
    this.loadTransactions();
  }

  setDefaultDates() {
    const now = new Date();
    // Primer día del mes actual: 2026-02-01
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    // Último día del mes actual
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    this.startDate.set(firstDay);
    this.endDate.set(lastDay);
  }

  loadTransactions() {
    this.transactionService.findAll().subscribe(data => {
      this.allTransactions.set(data)
    });
  }

  // LA MAGIA: Esta señal se filtra sola
  filteredTransactions = computed(() => {
    return this.allTransactions().filter(t => {
      const matchType = this.filterType() === 'ALL' || t.type === this.filterType();
      const matchCategory = this.filterCategory() === 'ALL' || t.category === this.filterCategory();
      const matchDate = t.date >= this.startDate() && t.date <= this.endDate();

      return matchType && matchCategory && matchDate;
    });
  });

  updateFilter(event: any, field: string) {
    const value = event.target.value;
    if (field === 'type') this.filterType.set(value);
    if (field === 'category') this.filterCategory.set(value);
    if (field === 'start') this.startDate.set(value);
    if (field === 'end') this.endDate.set(value);
  }

  // Suma total de solo los INGRESOS filtrados
  totalIncomes = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.value, 0);
  });

  // Suma total de solo los EGRESOS filtrados
  totalEgresses = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === 'EGRESS')
      .reduce((acc, t) => acc + t.value, 0);
  });

  // El balance general (puedes usar los dos anteriores para simplificar)
  totalBalance = computed(() => {
    return this.totalIncomes() - this.totalEgresses();
  });

  deleteTransaction(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      this.transactionService.delete(id).subscribe({
        next: () => {
          // Actualizamos la lista local después de eliminar con éxito
          // Si usas signals:
          this.allTransactions.set(
            this.allTransactions().filter(t => t.id !== id)
          );
          alert('Movimiento eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar el movimiento');
        }
      });
    }
  }

}
