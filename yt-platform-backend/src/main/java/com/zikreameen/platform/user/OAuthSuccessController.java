package com.zikreameen.platform.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/oauth")
public class OAuthSuccessController {

    @GetMapping("/callback-info")
    public ResponseEntity<Map<String, Object>> getCallbackInfo(
            @RequestParam(required = false) String accessToken,
            @RequestParam(required = false) String refreshToken,
            @RequestParam(required = false) String email
    ) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("email", email);
        response.put("hasAccessToken", accessToken != null && !accessToken.isBlank());
        response.put("hasRefreshToken", refreshToken != null && !refreshToken.isBlank());
        return ResponseEntity.ok(response);
    }
}
