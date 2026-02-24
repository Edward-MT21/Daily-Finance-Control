package com.project.dafico.controllers;

import com.project.dafico.entities.User;
import com.project.dafico.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/UserController")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        return userService.authenticate(user.getUsername(), user.getPassword())
                .map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User nuevoUsuario = userService.register(user);
        return ResponseEntity.status(201).body(nuevoUsuario);
    }
}
