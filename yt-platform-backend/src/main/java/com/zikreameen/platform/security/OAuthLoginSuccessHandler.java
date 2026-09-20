package com.zikreameen.platform.security;

import com.zikreameen.platform.user.AuthService;
import com.zikreameen.platform.user.UserAccount;
import com.zikreameen.platform.user.UserAccountRepository;
import com.zikreameen.platform.user.dto.TokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuthLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserAccountRepository userAccountRepository;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public OAuthLoginSuccessHandler(AuthService authService, UserAccountRepository userAccountRepository) {
        this.authService = authService;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        UserAccount user = userAccountRepository.findByEmail(email)
                .map(existing -> {
                    existing.setFullName(name != null ? name : existing.getFullName());
                    existing.setAvatarUrl(avatarUrl != null ? avatarUrl : existing.getAvatarUrl());
                    return userAccountRepository.save(existing);
                })
                .orElseGet(() -> {
                    UserAccount newUser = new UserAccount();
                    newUser.setEmail(email);
                    newUser.setFullName(name != null ? name : "Google User");
                    newUser.setAvatarUrl(avatarUrl);
                    newUser.setProvider("GOOGLE");
                    newUser.setProviderId(providerId);
                    newUser.setRole("ROLE_USER");
                    return userAccountRepository.save(newUser);
                });

        TokenResponse tokenResponse = authService.generateTokensForUser(user);

        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth/callback")
                .queryParam("accessToken", tokenResponse.getAccessToken())
                .queryParam("refreshToken", tokenResponse.getRefreshToken())
                .queryParam("email", user.getEmail())
                .queryParam("name", user.getFullName())
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
