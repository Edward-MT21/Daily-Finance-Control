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

  ngOnInit(): void {
    // Obtener date actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().substring(0, 10);

    this.transactionForm = this.fb.group({
      type: ['INGRESO', Validators.required], // 'INGRESO' por defecto
      date: [hoy, Validators.required],      // date actual por defecto
      value: ['', [Validators.required, Validators.min(1)]]
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
