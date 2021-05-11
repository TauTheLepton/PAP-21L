package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PublicEvent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PublicEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PublicEventRepository extends JpaRepository<PublicEvent, Long> {}
