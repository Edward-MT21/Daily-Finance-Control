import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/TransactionController';

    save(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(this.apiUrl, transaction);
    }

    findAll(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(this.apiUrl);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    update(transaction: Transaction): Observable<any> {
        // Enviamos el objeto actualizado al endpoint específico del ID
        return this.http.put(`${this.apiUrl}`, transaction);
    }

}