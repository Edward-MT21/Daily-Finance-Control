package com.project.dafico.services;

import com.project.dafico.entities.Transaction;
import com.project.dafico.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> findAll() {
        return repository.findAllByOrderByDateDesc();
    }

    public Transaction save(Transaction transaction) {
        // Ejemplo de lógica de negocio: Validar que el valor no sea negativo
        if (transaction.getValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El valor de la transacción no puede ser negativo");
        }
        return repository.save(transaction);
    }

    public void delete(Long id) {
        // Es buena práctica verificar si existe antes de intentar borrar
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Movimiento no encontrado con el id: " + id);
        }
    }

    public Transaction updateTransaction(Transaction details) {
        // Buscamos la transacción existente
        Transaction transaction = transactionRepository.findById(details.getId())
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada con id: " + details.getId()));

        // Actualizamos los campos necesarios
        transaction.setDate(details.getDate());
        transaction.setValue(details.getValue());
        transaction.setDescription(details.getDescription());
        transaction.setStatus(details.getStatus()); // El nuevo campo PENDING/COMPLETED

        // Guardamos y retornamos la entidad actualizada
        return transactionRepository.save(transaction);
    }

}
