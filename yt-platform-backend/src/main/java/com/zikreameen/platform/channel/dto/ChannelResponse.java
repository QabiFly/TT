package com.zikreameen.platform.channel.dto;

import com.zikreameen.platform.channel.Channel;
import java.time.Instant;

public class ChannelResponse {

    private Long id;
    private Long userId;
    private String handle;
    private String name;
    private String description;
    private String avatarUrl;
    private String bannerUrl;
    private Long subscriberCount;
    private Integer videoCount;
    private Instant createdAt;
    private Instant updatedAt;

    public ChannelResponse() {
    }

    public static ChannelResponse fromEntity(Channel channel) {
        ChannelResponse res = new ChannelResponse();
        res.setId(channel.getId());
        res.setUserId(channel.getUser() != null ? channel.getUser().getId() : null);
        res.setHandle(channel.getHandle());
        res.setName(channel.getName());
        res.setDescription(channel.getDescription());
        res.setAvatarUrl(channel.getAvatarUrl());
        res.setBannerUrl(channel.getBannerUrl());
        res.setSubscriberCount(channel.getSubscriberCount());
        res.setVideoCount(channel.getVideoCount());
        res.setCreatedAt(channel.getCreatedAt());
        res.setUpdatedAt(channel.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public Long getSubscriberCount() {
        return subscriberCount;
    }

    public void setSubscriberCount(Long subscriberCount) {
        this.subscriberCount = subscriberCount;
    }

    public Integer getVideoCount() {
        return videoCount;
    }

    public void setVideoCount(Integer videoCount) {
        this.videoCount = videoCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
