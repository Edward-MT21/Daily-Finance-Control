import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { RouterOutlet } from '@angular/router';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-transaction-record',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-record.html',
  styleUrl: './transaction-record.css',
})
export class TransactionRecord {

  private fb = inject(FormBuilder);
  masterDataService = inject(MasterDataService);
  private transactionService = inject(TransactionService);
  
  transactionForm!: FormGroup;
  
  categories = this.masterDataService.categories;

  ngOnInit(): void {
    // Obtener date actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().substring(0, 10);

    this.transactionForm = this.fb.group({
      type: ['INCOME', Validators.required], // 'INCOME' by default
      category: ['HOME', [Validators.required]],
      date: [hoy, Validators.required],      // date current by default
      value: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const datos: Transaction = this.transactionForm.value;
      console.log({ datos });
      this.transactionService.save(datos).subscribe({
        next: (res) => {
          alert('¡Registro guardado con éxito!');
          this.transactionForm.reset({
            type: 'INGRESO',
            date: new Date().toISOString().substring(0, 10),
            value: ''
          });
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Hubo un error al conectar con el servidor.');
        }
      });
    }
  }

}
