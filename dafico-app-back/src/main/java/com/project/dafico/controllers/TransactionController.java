package com.project.dafico.controllers;


import com.project.dafico.entities.Transaction;
import com.project.dafico.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/TransactionController")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    @Autowired
    private TransactionRepository repository;

    @PostMapping
    public Transaction save(@RequestBody Transaction transaccion) {
        // Aquí podrías agregar lógica extra, como validar el saldo
        return repository.save(transaccion);
    }

    @GetMapping
    public List<Transaction> findAll() {
        return repository.findAll();
    }

}
