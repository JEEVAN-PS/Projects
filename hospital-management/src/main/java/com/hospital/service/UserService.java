package com.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.model.User;
import com.hospital.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }
    public boolean validateUser(String username, String password) {

    User user = userRepository.findByEmail(username).orElse(null);

    if(user == null) {
        return false;
    }

    return user.getPassword().equals(password);
}
}