package com.artiq.back.matching.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.repository.AppraiseFinRepositoryOk;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertListService {

    @Autowired
    private AppraiseFinRepositoryOk appraiseFinRepositoryOk;

    public List<ExpertRequestEntityOk> getAllTestEntities() {
        return appraiseFinRepositoryOk.findAll();
    }
}
