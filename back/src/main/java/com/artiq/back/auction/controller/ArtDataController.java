package com.artiq.back.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.service.ArtDataService;

@RestController
public class ArtDataController {

    @Autowired
    private ArtDataService artDataService;

    @PostMapping("/insertData")
       public ResponseEntity<String> saveArtData(@RequestBody List<ArtDataEntity> dataList) {
        try {
            artDataService.saveArtData(dataList);
            return new ResponseEntity<>("저장성공", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error saving data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
