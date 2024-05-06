package com.artiq.back.matching.service;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.artiq.back.matching.entity.RequestEntity;

import org.springframework.util.ObjectUtils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Component
public class CommissionHandler {
    
    public RequestEntity parseRequestInfo(@RequestParam("file") MultipartFile file,
                                    @RequestParam("reGenre") String reGenre,
                                    @RequestParam("reField") String reField,
                                    @RequestParam("reqUserEmail") String reqUserEmail,
                                    @RequestParam("userName") String userName,
                                    @RequestParam("reArtwork") String reArtwork,
                                    @RequestParam("reArtist") String reArtist,
                                    @RequestParam("reSize") String reSize,
                                    @RequestParam("reProductYear") String reProductYear,
                                    @RequestParam("reDetails") String reDetails,
                                    @RequestParam("userEmail") String email) throws Exception {

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        String current_date = simpleDateFormat.format(new Date());

        // 파일 저장
        String absolutePath = new File("").getAbsolutePath() + "\\";

        String path = "src/main/resources/static/images/" + current_date;

        File filee = new File(path);

        if (!filee.exists()) {

            filee.mkdirs();
        }

        if (!file.isEmpty()) {

            String contentType = file.getContentType();
            String originalFileExtension;

            if (ObjectUtils.isEmpty(contentType)) {
                return null;
            } else {
                if (contentType.contains("image/jpeg")) {
                    originalFileExtension = ".jpg";
                } else if (contentType.contains("image/png")) {
                    originalFileExtension = ".png";
                }
                else {
                    return null;
                }
            }

            String new_file_name = System.nanoTime() + originalFileExtension;

            RequestEntity ERE = RequestEntity.builder()
                .userName(userName)
                .reqUserEmail(reqUserEmail)
                .reGenre(reGenre)
                .reField(reField)
                .reArtwork(reArtwork)
                .reArtist(reArtist)
                .reProductYear(reProductYear)
                .reDetails(reDetails)
                .originalFileName(file.getOriginalFilename())
                .saveFileName(path + "/" + new_file_name)
                .imageURL("http://localhost:4000/images/" + current_date + "/" + new_file_name)
                .reSize(reSize)
                .userEmail(email)
                .apDate(LocalDate.now())
                .build();

            filee = new File(absolutePath + path + "/" + new_file_name);
            file.transferTo(filee);

            return ERE;
        }
        return null;
    }
}
