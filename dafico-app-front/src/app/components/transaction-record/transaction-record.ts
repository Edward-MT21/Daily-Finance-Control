import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { MasterDataService } from '../../services/master-data.service';
import Swal from 'sweetalert2';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


dayjs.extend(utc);
dayjs.extend(timezone);
// Obtiene el ISO string con la hora y desfase exacto de Colombia
const dateColombia = dayjs().tz('America/Bogota').format(); 
// Resultado esperado: 2026-08-28T21:49:00-05:00

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

  //hoy = new Date().toISOString().substring(0, 10); //toISOString() convierte siempre la fecha y hora actual al estándar UTC (Tiempo Universal Coordinado), ignorando la zona horaria local de tu equipo.  Colombia se encuentra en la zona horaria UTC-5 (es decir, 5 horas por detrás del meridiano de Greenwich).
  hoy = dateColombia;





  ngOnInit(): void {

    this.transactionForm = this.fb.group({
      type: ['INCOME', Validators.required], // 'INCOME' by default
      category: [null, [Validators.required]],
      date: [this.hoy, Validators.required],      // date current by default
      value: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      status: ['COMPLETED']
    });

    console.log("hoy", this.hoy)
    console.log("new Date().toISOString()", new Date().toISOString())
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const datos: Transaction = this.transactionForm.value;

      this.transactionService.save(datos).subscribe({
        next: (res) => {
          // Notificación tipo Toast (Elegante y rápida)
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });

          Toast.fire({
            icon: 'success',
            title: '¡Movimiento guardado con éxito!'
          });

          // Reseteamos el formulario
          this.transactionForm.reset({
            type: 'INCOME',
            category: null,
            date: this.hoy,
            value: '',
            description: '',
            status: 'COMPLETED'
          });
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          // Error visual con estilo Dafico
          Swal.fire({
            title: 'Error al guardar',
            text: 'Hubo un problema al conectar con el servidor. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#4a90e2'
          });
        }
      });
    }

  }

  togglePending(event: any) {
    const isChecked = event.target.checked;
    // Actualizamos el valor del formulario internamente
    this.transactionForm.patchValue({
      status: isChecked ? 'PENDING' : 'COMPLETED'
    });

  }

}
