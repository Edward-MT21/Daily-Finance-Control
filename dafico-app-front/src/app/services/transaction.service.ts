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

}