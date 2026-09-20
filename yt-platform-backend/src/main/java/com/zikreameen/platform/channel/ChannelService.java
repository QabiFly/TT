package com.zikreameen.platform.channel;

import com.zikreameen.platform.channel.dto.ChannelResponse;
import com.zikreameen.platform.channel.dto.CreateChannelRequest;
import com.zikreameen.platform.common.ApiException;
import com.zikreameen.platform.storage.StorageService;
import com.zikreameen.platform.user.UserAccount;
import com.zikreameen.platform.user.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final UserAccountRepository userAccountRepository;
    private final StorageService storageService;

    public ChannelService(
            ChannelRepository channelRepository,
            UserAccountRepository userAccountRepository,
            StorageService storageService
    ) {
        this.channelRepository = channelRepository;
        this.userAccountRepository = userAccountRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ChannelResponse createChannel(Long userId, CreateChannelRequest request) {
        if (channelRepository.existsByUserId(userId)) {
            throw new ApiException("User already has a channel", HttpStatus.CONFLICT);
        }

        String normalizedHandle = request.getHandle().toLowerCase().trim();
        if (channelRepository.existsByHandle(normalizedHandle)) {
            throw new ApiException("Channel handle is already taken", HttpStatus.CONFLICT);
        }

        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Channel channel = new Channel();
        channel.setUser(user);
        channel.setHandle(normalizedHandle);
        channel.setName(request.getName().trim());
        channel.setDescription(request.getDescription());
        channel.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : user.getAvatarUrl());
        channel.setBannerUrl(request.getBannerUrl());
        channel.setSubscriberCount(0L);
        channel.setVideoCount(0);

        Channel saved = channelRepository.save(channel);
        return ChannelResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ChannelResponse getChannelById(Long id) {
        Channel channel = channelRepository.findById(id)
                .orElseThrow(() -> new ApiException("Channel not found", HttpStatus.NOT_FOUND));
        return ChannelResponse.fromEntity(channel);
    }

    @Transactional(readOnly = true)
    public ChannelResponse getChannelByHandle(String handle) {
        Channel channel = channelRepository.findByHandle(handle.toLowerCase().trim())
                .orElseThrow(() -> new ApiException("Channel not found with handle @" + handle, HttpStatus.NOT_FOUND));
        return ChannelResponse.fromEntity(channel);
    }

    @Transactional(readOnly = true)
    public ChannelResponse getMyChannel(Long userId) {
        Channel channel = channelRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("You do not have a channel yet", HttpStatus.NOT_FOUND));
        return ChannelResponse.fromEntity(channel);
    }

    @Transactional
    public ChannelResponse updateChannel(Long userId, CreateChannelRequest request) {
        Channel channel = channelRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Channel not found for current user", HttpStatus.NOT_FOUND));

        if (request.getHandle() != null && !request.getHandle().equalsIgnoreCase(channel.getHandle())) {
            String newHandle = request.getHandle().toLowerCase().trim();
            if (channelRepository.existsByHandle(newHandle)) {
                throw new ApiException("Channel handle is already taken", HttpStatus.CONFLICT);
            }
            channel.setHandle(newHandle);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            channel.setName(request.getName().trim());
        }

        if (request.getDescription() != null) {
            channel.setDescription(request.getDescription());
        }

        if (request.getAvatarUrl() != null) {
            channel.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getBannerUrl() != null) {
            channel.setBannerUrl(request.getBannerUrl());
        }

        Channel updated = channelRepository.save(channel);
        return ChannelResponse.fromEntity(updated);
    }

    @Transactional
    public ChannelResponse uploadAvatar(Long userId, MultipartFile file) throws IOException {
        Channel channel = channelRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Channel not found", HttpStatus.NOT_FOUND));

        String url = storageService.uploadFile(file, "avatars");
        channel.setAvatarUrl(url);
        return ChannelResponse.fromEntity(channelRepository.save(channel));
    }

    @Transactional
    public ChannelResponse uploadBanner(Long userId, MultipartFile file) throws IOException {
        Channel channel = channelRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Channel not found", HttpStatus.NOT_FOUND));

        String url = storageService.uploadFile(file, "banners");
        channel.setBannerUrl(url);
        return ChannelResponse.fromEntity(channelRepository.save(channel));
    }
}
