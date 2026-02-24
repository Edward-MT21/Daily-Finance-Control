import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signal para saber si hay alguien logueado
  currentUser = signal<string | null>(localStorage.getItem('user'));

  login(credentials: any) {
    return this.http.post('http://localhost:8080/UserController/login', credentials).pipe(
      tap((user: any) => {
        localStorage.setItem('user', user.username);
        this.currentUser.set(user.username);
        this.router.navigate(['/transaction-record']); // Lo mandamos a las gráficas
      })
    );
  }

  logout() {
    Swal.fire({
      title: 'Log out?',
      text: "You will need to enter your credentials again.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4a90e2', // El azul de tu logo
      cancelButtonColor: '#ff4757', // El rojo de tu botón
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

}