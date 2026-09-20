package com.zikreameen.platform.channel;

import com.zikreameen.platform.channel.dto.ChannelResponse;
import com.zikreameen.platform.channel.dto.CreateChannelRequest;
import com.zikreameen.platform.security.AppPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping
    public ResponseEntity<ChannelResponse> createChannel(
            @AuthenticationPrincipal AppPrincipal principal,
            @Valid @RequestBody CreateChannelRequest request
    ) {
        ChannelResponse response = channelService.createChannel(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ChannelResponse> getMyChannel(@AuthenticationPrincipal AppPrincipal principal) {
        ChannelResponse response = channelService.getMyChannel(principal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChannelResponse> getChannelById(@PathVariable Long id) {
        ChannelResponse response = channelService.getChannelById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/handle/{handle}")
    public ResponseEntity<ChannelResponse> getChannelByHandle(@PathVariable String handle) {
        ChannelResponse response = channelService.getChannelByHandle(handle);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/my")
    public ResponseEntity<ChannelResponse> updateChannel(
            @AuthenticationPrincipal AppPrincipal principal,
            @Valid @RequestBody CreateChannelRequest request
    ) {
        ChannelResponse response = channelService.updateChannel(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/my/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChannelResponse> uploadAvatar(
            @AuthenticationPrincipal AppPrincipal principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        ChannelResponse response = channelService.uploadAvatar(principal.getId(), file);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/my/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChannelResponse> uploadBanner(
            @AuthenticationPrincipal AppPrincipal principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        ChannelResponse response = channelService.uploadBanner(principal.getId(), file);
        return ResponseEntity.ok(response);
    }
}
