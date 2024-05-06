package com.artiq.back.matching.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.repository.AppraiseFinRepository;

@Service
public class FileService {

    private final AppraiseFinRepository appraiseFinRepository;

    private final FileHandler fileHandler;

    public FileService(AppraiseFinRepository appraiseFinRepository, FileHandler fileHandler) {

        this.appraiseFinRepository = appraiseFinRepository;
        this.fileHandler = fileHandler;

    }
    

    public Optional<ExpertRequestEntity> checkEmail(String userEmail) {
        System.out.println(userEmail + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // return fileRepository.findByUserEmail(userEmail);
        Optional<ExpertRequestEntity> result = appraiseFinRepository.findByUserEmail(userEmail);
        System.out.println("Result from repository: 222222222222222222222222222222222" + result);
        return result;
    }

    public ExpertRequestEntity addExpertRequestEntity(MultipartFile file, String userEmail, String reField,
            String apCareer, String apMassage, String userName, String reGenre1, String reGenre2, String reGenre3,
            String reGenre4, String reGenre5) throws Exception {
        ExpertRequestEntity savedEntity = fileHandler.parseFileInfo(file, userEmail, reField, apCareer, apMassage,
                userName,
                reGenre1, reGenre2, reGenre3, reGenre4, reGenre5);

        return appraiseFinRepository.save(savedEntity);
    }

    public Optional<ExpertRequestEntity> findExpertRequestEntity(int apNO) {
        return appraiseFinRepository.findById(apNO);
    }
}
