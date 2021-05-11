package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PublicEvent;
import com.mycompany.myapp.repository.PublicEventRepository;
import com.mycompany.myapp.service.PublicEventService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.PublicEvent}.
 */
@RestController
@RequestMapping("/api")
public class PublicEventResource {

    private final Logger log = LoggerFactory.getLogger(PublicEventResource.class);

    private static final String ENTITY_NAME = "publicEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PublicEventService publicEventService;

    private final PublicEventRepository publicEventRepository;

    public PublicEventResource(PublicEventService publicEventService, PublicEventRepository publicEventRepository) {
        this.publicEventService = publicEventService;
        this.publicEventRepository = publicEventRepository;
    }

    /**
     * {@code POST  /public-events} : Create a new publicEvent.
     *
     * @param publicEvent the publicEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new publicEvent, or with status {@code 400 (Bad Request)} if the publicEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/public-events")
    public ResponseEntity<PublicEvent> createPublicEvent(@Valid @RequestBody PublicEvent publicEvent) throws URISyntaxException {
        log.debug("REST request to save PublicEvent : {}", publicEvent);
        if (publicEvent.getId() != null) {
            throw new BadRequestAlertException("A new publicEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PublicEvent result = publicEventService.save(publicEvent);
        return ResponseEntity
            .created(new URI("/api/public-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /public-events/:id} : Updates an existing publicEvent.
     *
     * @param id the id of the publicEvent to save.
     * @param publicEvent the publicEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publicEvent,
     * or with status {@code 400 (Bad Request)} if the publicEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the publicEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/public-events/{id}")
    public ResponseEntity<PublicEvent> updatePublicEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PublicEvent publicEvent
    ) throws URISyntaxException {
        log.debug("REST request to update PublicEvent : {}, {}", id, publicEvent);
        if (publicEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, publicEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publicEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PublicEvent result = publicEventService.save(publicEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, publicEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /public-events/:id} : Partial updates given fields of an existing publicEvent, field will ignore if it is null
     *
     * @param id the id of the publicEvent to save.
     * @param publicEvent the publicEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publicEvent,
     * or with status {@code 400 (Bad Request)} if the publicEvent is not valid,
     * or with status {@code 404 (Not Found)} if the publicEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the publicEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/public-events/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PublicEvent> partialUpdatePublicEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PublicEvent publicEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update PublicEvent partially : {}, {}", id, publicEvent);
        if (publicEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, publicEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publicEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PublicEvent> result = publicEventService.partialUpdate(publicEvent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, publicEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /public-events} : get all the publicEvents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of publicEvents in body.
     */
    @GetMapping("/public-events")
    public List<PublicEvent> getAllPublicEvents() {
        log.debug("REST request to get all PublicEvents");
        return publicEventService.findAll();
    }

    /**
     * {@code GET  /public-events/:id} : get the "id" publicEvent.
     *
     * @param id the id of the publicEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the publicEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/public-events/{id}")
    public ResponseEntity<PublicEvent> getPublicEvent(@PathVariable Long id) {
        log.debug("REST request to get PublicEvent : {}", id);
        Optional<PublicEvent> publicEvent = publicEventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(publicEvent);
    }

    /**
     * {@code DELETE  /public-events/:id} : delete the "id" publicEvent.
     *
     * @param id the id of the publicEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/public-events/{id}")
    public ResponseEntity<Void> deletePublicEvent(@PathVariable Long id) {
        log.debug("REST request to delete PublicEvent : {}", id);
        publicEventService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
