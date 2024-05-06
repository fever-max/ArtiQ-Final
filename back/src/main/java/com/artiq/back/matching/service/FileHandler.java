package com.artiq.back.matching.service;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.artiq.back.matching.entity.ExpertRequestEntity;

import org.springframework.util.ObjectUtils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Component
public class FileHandler {

    public ExpertRequestEntity parseFileInfo(@RequestParam("file") MultipartFile file,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("reField") String reField,
            @RequestParam("apCareer") String apCareer,
            @RequestParam("apMassage") String apMassage,
            @RequestParam("userName") String userName,
            @RequestParam("reGenre1") String reGenre1,
            @RequestParam("reGenre2") String reGenre2,
            @RequestParam("reGenre3") String reGenre3,
            @RequestParam("reGenre4") String reGenre4,
            @RequestParam("reGenre5") String reGenre5) throws Exception {

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
                } else {
                    return null;
                }
            }

            String new_file_name = System.nanoTime() + originalFileExtension;

            ExpertRequestEntity ERE = ExpertRequestEntity.builder()
                    .userName(userName)
                    .userEmail(userEmail)
                    .reField(reField)
                    .reGenre1(reGenre1)
                    .reGenre2(reGenre2)
                    .reGenre3(reGenre3)
                    .reGenre4(reGenre4)
                    .reGenre5(reGenre5)
                    .apCareer(apCareer)
                    .apMessage(apMassage)
                    .originalFileName(file.getOriginalFilename())
                    .saveFileName(path + "/" + new_file_name)
                    .imageURL("http://localhost:4000/images/" + current_date + "/" + new_file_name)
                    .fileSize(file.getSize())
                    .apDate(LocalDate.now()) // 신청날짜
                    .build();

            System.out.println("ExpertRequestEntity 정보: " + ERE.toString());

            filee = new File(absolutePath + path + "/" + new_file_name);
            file.transferTo(filee);

            return ERE;
        }
        return null;
    }
}