package com.zikreameen.platform.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "cloudinary")
public class CloudinaryStorageService implements StorageService {

    private final Cloudinary cloudinary;

    public CloudinaryStorageService(
            @Value("${app.storage.cloudinary.cloud-name:}") String cloudName,
            @Value("${app.storage.cloudinary.api-key:}") String apiKey,
            @Value("${app.storage.cloudinary.api-secret:}") String apiSecret
    ) {
        if (cloudName != null && !cloudName.isBlank() && apiKey != null && !apiKey.isBlank()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
        } else {
            this.cloudinary = null;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (cloudinary == null) {
            throw new IllegalStateException("Cloudinary credentials are not configured");
        }
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto"
        ));
        return (String) uploadResult.get("secure_url");
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (cloudinary == null || fileUrl == null) {
            return;
        }
        try {
            // Extract public ID from Cloudinary URL if needed
            String publicId = extractPublicId(fileUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception ignored) {
        }
    }

    private String extractPublicId(String fileUrl) {
        try {
            int uploadIndex = fileUrl.indexOf("/upload/");
            if (uploadIndex == -1) return null;
            String afterUpload = fileUrl.substring(uploadIndex + 8);
            if (afterUpload.startsWith("v") && afterUpload.indexOf('/') != -1) {
                afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
            }
            int lastDot = afterUpload.lastIndexOf('.');
            return lastDot != -1 ? afterUpload.substring(0, lastDot) : afterUpload;
        } catch (Exception e) {
            return null;
        }
    }
}
