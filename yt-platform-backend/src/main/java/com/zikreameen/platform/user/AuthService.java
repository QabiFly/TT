package com.zikreameen.platform.user;

import com.zikreameen.platform.common.ApiException;
import com.zikreameen.platform.security.JwtService;
import com.zikreameen.platform.user.dto.LoginRequest;
import com.zikreameen.platform.user.dto.RefreshRequest;
import com.zikreameen.platform.user.dto.RegisterRequest;
import com.zikreameen.platform.user.dto.TokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final long refreshDays;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserAccountRepository userRepo,
                      RefreshTokenRepository refreshRepo,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService,
                      @Value("${app.jwt.refresh-token-days:30}") long refreshDays) {
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshDays = refreshDays;
    }

    public TokenResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepo.existsByEmailIgnoreCase(email)) {
            throw new ApiException(409, "ye email pehle se registered hai, login karo");
        }
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepo.save(user);
        return issueTokens(user);
    }

    public TokenResponse login(LoginRequest request) {
        UserAccount user = userRepo.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ApiException(401, "email ya password galat hai"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(401, "email ya password galat hai");
        }
        return issueTokens(user);
    }

    /**
     * Google login (direct OAuth2 — no Firebase).
     * Email pehle se hai to wahi account use hota hai (Google + password dono rahenge),
     * nahi to naya account ban jata hai random password ke saath.
     */
    public TokenResponse loginWithGoogle(String email) {
        String normalized = email.trim().toLowerCase();
        UserAccount user = userRepo.findByEmailIgnoreCase(normalized)
                .orElseGet(() -> {
                    UserAccount newUser = new UserAccount();
                    newUser.setEmail(normalized);
                    // Google user ka apna password nahi — random unusable hash
                    newUser.setPasswordHash(passwordEncoder.encode(
                            "google:" + UUID.randomUUID()));
                    return userRepo.save(newUser);
                });
        return issueTokens(user);
    }

    /** Purana refresh token revoke karke naya pair deta hai (rotation). */
    public TokenResponse refresh(RefreshRequest request) {
        RefreshToken token = refreshRepo.findByTokenHash(sha256Hex(request.refreshToken()))
                .orElseThrow(() -> new ApiException(401, "refresh token invalid hai, dobara login karo"));
        if (token.isRevoked() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(401, "refresh token expire ho gaya, dobara login karo");
        }
        token.setRevoked(true);
        refreshRepo.save(token);

        UserAccount user = userRepo.findById(token.getUserId())
                .orElseThrow(() -> new ApiException(401, "user nahi mila, dobara login karo"));
        return issueTokens(user);
    }

    private TokenResponse issueTokens(UserAccount user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = generateRefreshToken();

        RefreshToken entity = new RefreshToken();
        entity.setUserId(user.getId());
        entity.setTokenHash(sha256Hex(refreshToken));
        entity.setExpiresAt(Instant.now().plus(refreshDays, ChronoUnit.DAYS));
        refreshRepo.save(entity);

        return new TokenResponse(accessToken, refreshToken, "Bearer", jwtService.getAccessMinutes());
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 available nahi hai", e);
        }
    }
}
