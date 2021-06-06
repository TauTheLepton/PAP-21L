package com.headempty.xd365calendar.service.impl;

import com.headempty.xd365calendar.domain.PublicEvent;
import com.headempty.xd365calendar.repository.PublicEventRepository;
import com.headempty.xd365calendar.service.PublicEventService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link PublicEvent}.
 */
@Service
@Transactional
public class PublicEventServiceImpl implements PublicEventService {

    private final Logger log = LoggerFactory.getLogger(PublicEventServiceImpl.class);

    private final PublicEventRepository publicEventRepository;

    public PublicEventServiceImpl(PublicEventRepository publicEventRepository) {
        this.publicEventRepository = publicEventRepository;
    }

    @Override
    public PublicEvent save(PublicEvent publicEvent) {
        log.debug("Request to save PublicEvent : {}", publicEvent);
        return publicEventRepository.save(publicEvent);
    }

    @Override
    public Optional<PublicEvent> partialUpdate(PublicEvent publicEvent) {
        log.debug("Request to partially update PublicEvent : {}", publicEvent);

        return publicEventRepository
            .findById(publicEvent.getId())
            .map(
                existingPublicEvent -> {
                    if (publicEvent.getEventName() != null) {
                        existingPublicEvent.setEventName(publicEvent.getEventName());
                    }
                    if (publicEvent.getEventDate() != null) {
                        existingPublicEvent.setEventDate(publicEvent.getEventDate());
                    }
                    if (publicEvent.getHowManyInstances() != null) {
                        existingPublicEvent.setHowManyInstances(publicEvent.getHowManyInstances());
                    }
                    if (publicEvent.getCycleLength() != null) {
                        existingPublicEvent.setCycleLength(publicEvent.getCycleLength());
                    }
                    if (publicEvent.getCycleUnit() != null) {
                        existingPublicEvent.setCycleUnit(publicEvent.getCycleUnit());
                    }
                    if (publicEvent.getCategory() != null) {
                        existingPublicEvent.setCategory(publicEvent.getCategory());
                    }

                    return existingPublicEvent;
                }
            )
            .map(publicEventRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicEvent> findAll() {
        log.debug("Request to get all PublicEvents");
        return publicEventRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PublicEvent> findOne(Long id) {
        log.debug("Request to get PublicEvent : {}", id);
        return publicEventRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PublicEvent : {}", id);
        publicEventRepository.deleteById(id);
    }
}
