package com.artiq.back.matching.service;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.repository.AppraiseFinRepositoryOk;
import com.artiq.back.matching.repository.RequestRepository;

import io.jsonwebtoken.lang.Collections;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommissionListService {

    @Autowired
    private AppraiseFinRepositoryOk appraiseFinRepositoryOk;

    @Autowired
    private RequestRepository requestRepository;

    public List<ExpertRequestEntityOk> getCommissionsByReGenreAndReField(String reField, String reGenre) {
        return appraiseFinRepositoryOk.findByReFieldAndReGenre(reField, reGenre);
    }

    @Transactional
    public void updateExpertEmail(String userEmail, String reqUserEmail) {

        Optional<ExpertRequestEntityOk> optionalExpertRequestEntityOk = appraiseFinRepositoryOk
                .findByUserEmail(userEmail);
        if (optionalExpertRequestEntityOk.isPresent()) {
            ExpertRequestEntityOk expertRequestEntityOk = optionalExpertRequestEntityOk.get();

            Optional<RequestEntity> optionalRequestEntity = requestRepository.findByReqUserEmail(reqUserEmail);
            if (optionalRequestEntity.isPresent()) {
                RequestEntity requestEntity = optionalRequestEntity.get();

                // RequestEntity userEmail 업데이트
                requestEntity.setUserEmail(expertRequestEntityOk.getUserEmail());

                requestRepository.save(requestEntity);
            } else {
                throw new EntityNotFoundException("RequestEntity with reqUserEmail " + reqUserEmail + " not found.");
            }
        } else {
            throw new EntityNotFoundException("ExpertRequestEntityOk with userEmail " + userEmail + " not found.");
        }
    }

    public Optional<RequestEntity> checkEmail(String reqUserEmail) {
        System.out.println(reqUserEmail + "@@@@@@userEmail@@@@@@@@@@@@333333333333333333333333");
        // return fileRepository.findByUserEmail(userEmail);
        Optional<RequestEntity> result = requestRepository.findByReqUserEmail(reqUserEmail);
        System.out.println("findByUserEmailAndReqUserEmail: 222222222222222222222222222222222" + result);
        return result;
    }
}