package com.artiq.back.matching.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.repository.RequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommissionService {
    
    private final RequestRepository requestRepository;

    private final CommissionHandler commissionHandler;

    public RequestEntity addRequestEntity(MultipartFile file,String reqUserEmail,String userName, String reArtwork,String reArtist,String reSize,String reProductYear,String reDetails,String reField, String reGenre,String email) throws Exception {
        RequestEntity savedEntity  = commissionHandler.parseRequestInfo(file,reGenre,reField,reqUserEmail, userName, reArtwork, reArtist, reSize, reProductYear, reDetails,email);
        
        return requestRepository.save(savedEntity);
    }

    public Optional<RequestEntity> findRequestEntity(int reOrderNo) {
        return requestRepository.findById(reOrderNo);
    }
    
}
