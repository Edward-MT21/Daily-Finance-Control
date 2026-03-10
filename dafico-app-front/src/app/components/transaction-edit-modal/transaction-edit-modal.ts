import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'transaction-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-edit-modal.html',
  styleUrl: './transaction-edit-modal.css',
})
export class TransactionEditModal implements OnInit {

  @Input() transaction: any; // Recibe la transacción a editar
  @Output() close = new EventEmitter<void>(); // Evento para cerrar
  @Output() saved = new EventEmitter<any>(); // Evento para avisar que se guardó

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      id: [this.transaction.id],
      date: [this.transaction.date, Validators.required],
      description: [this.transaction.description, Validators.maxLength(50)],
      value: [this.transaction.value, [Validators.required, Validators.min(0.01)]],
      status: [this.transaction.status],
    });
  }

  toggleStatus(event: any) {
    this.editForm.patchValue({
      status: event.target.checked ? 'PENDING' : 'COMPLETED'
    });
  }

  onSave() {
    if (this.editForm.valid) {
      this.saved.emit(this.editForm.value);
    }
  }




}
