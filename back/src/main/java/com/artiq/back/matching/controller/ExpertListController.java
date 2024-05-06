package com.artiq.back.matching.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.service.ExpertListService;

import java.util.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/data")
public class ExpertListController {
    
    @Autowired
    private ExpertListService expertListService;

    @GetMapping("/expertData")
    public List<ExpertRequestEntityOk> getAllTestEntities() {
        return expertListService.getAllTestEntities();
    }
}
