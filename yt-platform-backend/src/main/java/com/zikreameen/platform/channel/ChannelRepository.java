package com.zikreameen.platform.channel;

import com.zikreameen.platform.user.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    Optional<Channel> findByHandle(String handle);
    Optional<Channel> findByUser(UserAccount user);
    Optional<Channel> findByUserId(Long userId);
    boolean existsByHandle(String handle);
    boolean existsByUserId(Long userId);
}
