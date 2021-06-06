package com.headempty.xd365calendar.repository;

import com.headempty.xd365calendar.domain.PublicEvent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PublicEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PublicEventRepository extends JpaRepository<PublicEvent, Long> {
  
    @Query(value = "select login from Jhi_user where login = ?#{principal.username}", nativeQuery = true)
    String getCurrentLogin();
  
  }
  
