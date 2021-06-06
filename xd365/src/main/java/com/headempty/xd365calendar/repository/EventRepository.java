package com.headempty.xd365calendar.repository;

import java.util.List;

import com.headempty.xd365calendar.domain.Event;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Event entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

  @Query(value = "select * from Event where userlogin = ?#{principal.username}", nativeQuery = true)
  List<Event> findByUserIsCurrentUser();

  @Query(value = "select login from Jhi_user where login = ?#{principal.username}", nativeQuery = true)
  String getCurrentLogin();

}
