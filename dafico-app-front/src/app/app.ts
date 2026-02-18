import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private fb = inject(FormBuilder);
  transactionForm!: FormGroup;
  private transactionService = inject(TransactionService);
  categories = ['HOME', 'AGRICULTURE', 'FEEDING', 'TRANSPORT', 'HEALTH'];

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

  get filteredCategories() {
    const type = this.transactionForm.get('type')?.value;
    if (type === 'INCOME') {
      return ['HOME', 'INVESTMENT', 'OTHER_INCOME'];
    }
    return ['HOME', 'AGRICULTURE', 'FEEDING', 'TRANSPORT'];
  }

}
