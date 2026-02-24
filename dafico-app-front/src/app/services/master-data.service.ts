import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  // Usamos una Signal para que sea coherente con el resto de tu app
  private _categories = signal<string[]>(['HOME', 'AGRICULTURE', 'FEEDING', 'TRANSPORT', 'HEALTH']);

  private _months = [
    { value: 0, name: 'January' }, { value: 1, name: 'February' },
    { value: 2, name: 'March' }, { value: 3, name: 'April' },
    { value: 4, name: 'May' }, { value: 5, name: 'June' },
    { value: 6, name: 'July' }, { value: 7, name: 'August' },
    { value: 8, name: 'September' }, { value: 9, name: 'October' },
    { value: 10, name: 'November' }, { value: 11, name: 'December' }
  ];

  // Generamos un rango de años, por ejemplo: desde 2020 hasta el año actual + 1
  private _years: number[] = [];

  constructor() {
    const currentYear = new Date().getFullYear();
    const startYear = 2025; // Año en que inició Dafico
    for (let i = startYear; i <= currentYear + 1; i++) {
      this._years.push(i);
    }
  }

  // Exponemos la lista como solo lectura
  get categories() {
    return this._categories.asReadonly();
  }

  get months() { return this._months; }

  get years() { return this._years; }

}