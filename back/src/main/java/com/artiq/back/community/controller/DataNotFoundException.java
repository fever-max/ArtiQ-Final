package com.artiq.back.community.controller;

public class DataNotFoundException extends RuntimeException{

    private static final long serialVersionUID = 1L;
    
    public DataNotFoundException(String message) {
        super(message);
    }
}
