package com.artiq.back.config.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class CertificationNumberDao {
    // 레디스 dao (저장, 반환, 비교)

    private final StringRedisTemplate redisTemplate;

    // 3분을 초로 변환하여 상수로 정의
    private static final long EMAIL_VERIFICATION_LIMIT_IN_SECONDS = 180;

    public void saveCertificationNumber(String email, String certificationNumber) {
        redisTemplate.opsForValue()
                .set(email, certificationNumber,
                        Duration.ofSeconds(EMAIL_VERIFICATION_LIMIT_IN_SECONDS));
    }

    public String getCertificationNumber(String email) {
        return redisTemplate.opsForValue().get(email);
    }

    public void removeCertificationNumber(String email) {
        redisTemplate.delete(email);
    }

    public boolean hasKey(String email) {
        Boolean keyExists = redisTemplate.hasKey(email);
        return keyExists != null && keyExists;
    }
}