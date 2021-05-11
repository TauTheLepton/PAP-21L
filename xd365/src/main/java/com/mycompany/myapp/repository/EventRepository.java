package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Event;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Event entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

  @Query("select event from Event event where event.user.login = ?#{principal.username}")
  List<Event> findByUserIsCurrentUser();

}
