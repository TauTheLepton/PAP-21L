package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PublicEvent;
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

  @Query(value = "select * from PublicEvent where id = *tu chce wstawic zmienna*", nativeQuery = true)
  PublicEvent getById(int id);

}
