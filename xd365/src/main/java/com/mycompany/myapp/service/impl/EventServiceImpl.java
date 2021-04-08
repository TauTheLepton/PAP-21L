package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Event;
import com.mycompany.myapp.repository.EventRepository;
import com.mycompany.myapp.service.EventService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Event}.
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);
        return eventRepository.save(event);
    }

    @Override
    public Optional<Event> partialUpdate(Event event) {
        log.debug("Request to partially update Event : {}", event);

        return eventRepository
            .findById(event.getId())
            .map(
                existingEvent -> {
                    if (event.getEventName() != null) {
                        existingEvent.setEventName(event.getEventName());
                    }
                    if (event.getEventDate() != null) {
                        existingEvent.setEventDate(event.getEventDate());
                    }
                    if (event.getIsCyclical() != null) {
                        existingEvent.setIsCyclical(event.getIsCyclical());
                    }
                    if (event.getCycleLength() != null) {
                        existingEvent.setCycleLength(event.getCycleLength());
                    }
                    if (event.getCycleUnit() != null) {
                        existingEvent.setCycleUnit(event.getCycleUnit());
                    }
                    if (event.getIsPublic() != null) {
                        existingEvent.setIsPublic(event.getIsPublic());
                    }
                    if (event.getCategory() != null) {
                        existingEvent.setCategory(event.getCategory());
                    }

                    return existingEvent;
                }
            )
            .map(eventRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> findAll(Pageable pageable) {
        log.debug("Request to get all Events");
        return eventRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Event> findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }
}
