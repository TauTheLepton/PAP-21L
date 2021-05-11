package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.PublicEvent;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link PublicEvent}.
 */
public interface PublicEventService {
    /**
     * Save a publicEvent.
     *
     * @param publicEvent the entity to save.
     * @return the persisted entity.
     */
    PublicEvent save(PublicEvent publicEvent);

    /**
     * Partially updates a publicEvent.
     *
     * @param publicEvent the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PublicEvent> partialUpdate(PublicEvent publicEvent);

    /**
     * Get all the publicEvents.
     *
     * @return the list of entities.
     */
    List<PublicEvent> findAll();

    /**
     * Get the "id" publicEvent.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PublicEvent> findOne(Long id);

    /**
     * Delete the "id" publicEvent.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
