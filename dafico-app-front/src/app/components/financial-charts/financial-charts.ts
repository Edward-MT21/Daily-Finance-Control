import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../services/master-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-financial-charts',
  imports: [FormsModule],
  templateUrl: './financial-charts.html',
  styleUrl: './financial-charts.css',
})
export class FinancialCharts implements OnInit {

  private transactionService = inject(TransactionService);
  private masterDataService = inject(MasterDataService);

  @ViewChild('dailyChart') dailyCanvas!: ElementRef;
  @ViewChild('monthlyChart') monthlyCanvas!: ElementRef;

  allTransactions = signal<any[]>([]);
  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(new Date().getFullYear());

  dailyChartInst: Chart | null = null;
  monthlyChartInst: Chart | null = null;

  months = this.masterDataService.months;
  years = this.masterDataService.years;

  constructor() {
    // Este efecto "vigila" selectedMonth y selectedYear
    effect(() => {
      // Si cambian los filtros Y ya hay datos, redibujamos
      if (this.allTransactions().length > 0) {
        this.updateDailyChart();
        this.updateMonthlyChart();
      }
    });
  }

  ngOnInit() {
    // Solo nos encargamos de los datos
    this.transactionService.findAll().subscribe(data => {
      this.allTransactions.set(data);

      // Si por alguna razón el HTML ya estaba listo, dibujamos
      if (this.dailyCanvas) {
        this.updateDailyChart();
        this.updateMonthlyChart();
      }
    });
  }

  ngAfterViewInit() {
    // Si los datos llegaron antes de que el HTML cargara, 
    // este es el momento de dibujar
    if (this.allTransactions().length > 0) {
      this.updateDailyChart();
      this.updateMonthlyChart();
    }
  }

  updateDailyChart() {
    console.log(this.allTransactions(

    ));
    if (!this.dailyCanvas) return;
    const daysInMonth = new Date(this.selectedYear(), this.selectedMonth() + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const dataValues = labels.map(day => {
      const dayTrans = this.allTransactions().filter(t => {
        const { year, month, day: d } = this.parseUTCDate(t.date); // <-- USAR HELPER
        return d === day && month === this.selectedMonth() && year === this.selectedYear();
      });
      return dayTrans.reduce((acc, t) => t.type === 'INCOME' ? acc + t.value : acc - t.value, 0);
    });

    if (this.dailyChartInst) this.dailyChartInst.destroy();
    this.dailyChartInst = new Chart(this.dailyCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Balance Diario',
          data: dataValues,
          backgroundColor: dataValues.map(v => v < 0 ? '#dc3545' : '#4a90e2')
        }]
      }
    });
  }

  updateMonthlyChart() {
    if (!this.monthlyCanvas) return;

    const dataValues = this.months.map(m => {
      const monthTrans = this.allTransactions().filter(t => {
        const { year, month, day: d } = this.parseUTCDate(t.date); // <-- USAR HELPER
        return month === m.value && year === this.selectedYear();
      });
      return monthTrans.reduce((acc, t) => t.type === 'INCOME' ? acc + t.value : acc - t.value, 0);
    });

    if (this.monthlyChartInst) this.monthlyChartInst.destroy();
    this.monthlyChartInst = new Chart(this.monthlyCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.months.map(m => m.name),
        datasets: [{
          label: 'Balance Mensual',
          data: dataValues,
          backgroundColor: dataValues.map(v => v < 0 ? '#dc3545' : '#2ecc71')
        }]
      }
    });
  }

  // Crea esta pequeña función de ayuda (Helper)
  private parseUTCDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    // El mes en JS va de 0 a 11, por eso restamos 1
    return { year, month: month - 1, day };
  }

  setMonth(e: any) { this.selectedMonth.set(Number(e.target.value)); }
  setYear(e: any) { this.selectedYear.set(Number(e.target.value)); }

}
