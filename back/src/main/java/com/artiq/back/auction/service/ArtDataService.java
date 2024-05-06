package com.artiq.back.auction.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.repository.ArtDataRepository;

@Service
public class ArtDataService {

    @Autowired
    private ArtDataRepository artDataRepository;

// 전체 데이터 저장
    public void saveArtData(List<ArtDataEntity> dataList) {
    Optional<ArtDataEntity> existingArtData = artDataRepository.findById(1);
    if (!existingArtData.isPresent()) { // ArtDataEntity가 없는 경우에만 저장
        artDataRepository.saveAll(dataList);
    }
}

    //라이브 경매용 물품하나 들고오기
    public ArtDataEntity findOneAuctionData() {
        return artDataRepository.findById(22).orElse(null);
    }
}
