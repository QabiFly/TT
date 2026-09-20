# YouTube Platform Backend (`yt-platform-backend`)

Robust backend microservice for video streaming and channel management platform built with **Spring Boot 3**, **Spring Security 6**, **JWT & OAuth2**, **PostgreSQL**, **Flyway**, and pluggable **Cloudinary / Local Storage**.

---

## 🚀 Key Features

- **Authentication & Security:**
  - Standard Register & Login with encrypted passwords (BCrypt)
  - JWT (JSON Web Tokens) stateless authentication with Access & Refresh tokens
  - Google OAuth2 integration with custom success handling (`OAuthLoginSuccessHandler`)
  - Role-based and Principal-aware security filters (`JwtAuthFilter`, `AppPrincipal`)
  - Automated token rotation and revocation (`RefreshTokenRepository`)
- **Channel Management:**
  - Create channel with custom handle, name, description, and banner/avatar
  - Query channel by ID or unique handle
  - Update channel details with ownership checks
  - Subscriber count and video count tracking
- **Storage Abstraction:**
  - `StorageService` interface with dual implementations:
    - `LocalStorageService`: local disk storage for development/testing
    - `CloudinaryStorageService`: direct media upload to Cloudinary for production
- **Database & Migrations:**
  - PostgreSQL schema managed with Flyway migrations (`V1__init.sql`)
  - Spring Data JPA with clean repository patterns
- **Deployment Ready:**
  - Multi-stage `Dockerfile` with optimized JRE runtime
  - `docker-compose.yml` for local containerized Postgres & App
  - `render.yaml` for instant cloud deployment on Render

---

## 📂 Project Structure

```
yt-platform-backend/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── README.md
└── src/
    └── main/
        ├── resources/
        │   ├── application.yml
        │   └── db/migration/
        │       └── V1__init.sql
        └── java/com/zikreameen/platform/
            ├── YtPlatformApplication.java
            ├── common/
            │   ├── ApiException.java
            │   └── GlobalExceptionHandler.java
            ├── config/
            │   ├── SecurityConfig.java
            │   └── WebConfig.java
            ├── security/
            │   ├── AppPrincipal.java
            │   ├── JwtAuthFilter.java
            │   ├── JwtService.java
            │   └── OAuthLoginSuccessHandler.java
            ├── user/
            │   ├── UserAccount.java
            │   ├── RefreshToken.java
            │   ├── UserAccountRepository.java
            │   ├── RefreshTokenRepository.java
            │   ├── AuthService.java
            │   ├── AuthController.java
            │   ├── OAuthSuccessController.java
            │   └── dto/
            │       ├── LoginRequest.java
            │       ├── RegisterRequest.java
            │       ├── RefreshRequest.java
            │       └── TokenResponse.java
            ├── channel/
            │   ├── Channel.java
            │   ├── ChannelRepository.java
            │   ├── ChannelService.java
            │   ├── ChannelController.java
            │   └── dto/
            │       ├── CreateChannelRequest.java
            │       └── ChannelResponse.java
            └── storage/
                ├── StorageService.java
                ├── LocalStorageService.java
                └── CloudinaryStorageService.java
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `8080` |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/yt_platform` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | 256-bit secret key for HMAC SHA256 tokens | *(configured in application.yml)* |
| `JWT_EXPIRATION_MS` | Access token expiration duration in ms | `900000` (15 mins) |
| `JWT_REFRESH_EXPIRATION_MS`| Refresh token expiration duration in ms | `604800000` (7 days) |
| `STORAGE_TYPE` | Storage provider (`local` or `cloudinary`) | `local` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `FRONTEND_URL` | Client application origin for CORS & OAuth redirects | `http://localhost:3000` |

---

## 🛠️ Getting Started

### 1. Run with Docker Compose
```bash
docker-compose up -d
```

### 2. Local Maven Build & Run
```bash
./mvnw clean spring-boot:run
```
