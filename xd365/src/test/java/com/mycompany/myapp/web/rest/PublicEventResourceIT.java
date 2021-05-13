package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PublicEvent;
import com.mycompany.myapp.domain.enumeration.Category;
import com.mycompany.myapp.domain.enumeration.TimeUnits;
import com.mycompany.myapp.repository.PublicEventRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PublicEventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PublicEventResourceIT {

    private static final String DEFAULT_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_EVENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EVENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Long DEFAULT_HOW_MANY_INSTANCES = 1L;
    private static final Long UPDATED_HOW_MANY_INSTANCES = 2L;

    private static final Long DEFAULT_CYCLE_LENGTH = 1L;
    private static final Long UPDATED_CYCLE_LENGTH = 2L;

    private static final TimeUnits DEFAULT_CYCLE_UNIT = TimeUnits.DAYS;
    private static final TimeUnits UPDATED_CYCLE_UNIT = TimeUnits.WEEKS;

    private static final Category DEFAULT_CATEGORY = Category.RECREATION;
    private static final Category UPDATED_CATEGORY = Category.STUDYING;

    private static final String DEFAULT_USERLOGIN = "AAAAAAAAAA";
    private static final String UPDATED_USERLOGIN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/public-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PublicEventRepository publicEventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPublicEventMockMvc;

    private PublicEvent publicEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PublicEvent createEntity(EntityManager em) {
        PublicEvent publicEvent = new PublicEvent()
            .eventName(DEFAULT_EVENT_NAME)
            .eventDate(DEFAULT_EVENT_DATE)
            .howManyInstances(DEFAULT_HOW_MANY_INSTANCES)
            .cycleLength(DEFAULT_CYCLE_LENGTH)
            .cycleUnit(DEFAULT_CYCLE_UNIT)
            .category(DEFAULT_CATEGORY)
            .userlogin(DEFAULT_USERLOGIN);
        return publicEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PublicEvent createUpdatedEntity(EntityManager em) {
        PublicEvent publicEvent = new PublicEvent()
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .howManyInstances(UPDATED_HOW_MANY_INSTANCES)
            .cycleLength(UPDATED_CYCLE_LENGTH)
            .cycleUnit(UPDATED_CYCLE_UNIT)
            .category(UPDATED_CATEGORY)
            .userlogin(UPDATED_USERLOGIN);
        return publicEvent;
    }

    @BeforeEach
    public void initTest() {
        publicEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createPublicEvent() throws Exception {
        int databaseSizeBeforeCreate = publicEventRepository.findAll().size();
        // Create the PublicEvent
        restPublicEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isCreated());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeCreate + 1);
        PublicEvent testPublicEvent = publicEventList.get(publicEventList.size() - 1);
        assertThat(testPublicEvent.getEventName()).isEqualTo(DEFAULT_EVENT_NAME);
        assertThat(testPublicEvent.getEventDate()).isEqualTo(DEFAULT_EVENT_DATE);
        assertThat(testPublicEvent.getHowManyInstances()).isEqualTo(DEFAULT_HOW_MANY_INSTANCES);
        assertThat(testPublicEvent.getCycleLength()).isEqualTo(DEFAULT_CYCLE_LENGTH);
        assertThat(testPublicEvent.getCycleUnit()).isEqualTo(DEFAULT_CYCLE_UNIT);
        assertThat(testPublicEvent.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testPublicEvent.getUserlogin()).isEqualTo(DEFAULT_USERLOGIN);
    }

    @Test
    @Transactional
    void createPublicEventWithExistingId() throws Exception {
        // Create the PublicEvent with an existing ID
        publicEvent.setId(1L);

        int databaseSizeBeforeCreate = publicEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPublicEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isBadRequest());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEventNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicEventRepository.findAll().size();
        // set the field null
        publicEvent.setEventName(null);

        // Create the PublicEvent, which fails.

        restPublicEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isBadRequest());

        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEventDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicEventRepository.findAll().size();
        // set the field null
        publicEvent.setEventDate(null);

        // Create the PublicEvent, which fails.

        restPublicEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isBadRequest());

        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHowManyInstancesIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicEventRepository.findAll().size();
        // set the field null
        publicEvent.setHowManyInstances(null);

        // Create the PublicEvent, which fails.

        restPublicEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isBadRequest());

        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPublicEvents() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        // Get all the publicEventList
        restPublicEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(publicEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].eventName").value(hasItem(DEFAULT_EVENT_NAME)))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(DEFAULT_EVENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].howManyInstances").value(hasItem(DEFAULT_HOW_MANY_INSTANCES.intValue())))
            .andExpect(jsonPath("$.[*].cycleLength").value(hasItem(DEFAULT_CYCLE_LENGTH.intValue())))
            .andExpect(jsonPath("$.[*].cycleUnit").value(hasItem(DEFAULT_CYCLE_UNIT.toString())))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].userlogin").value(hasItem(DEFAULT_USERLOGIN)));
    }

    @Test
    @Transactional
    void getPublicEvent() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        // Get the publicEvent
        restPublicEventMockMvc
            .perform(get(ENTITY_API_URL_ID, publicEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(publicEvent.getId().intValue()))
            .andExpect(jsonPath("$.eventName").value(DEFAULT_EVENT_NAME))
            .andExpect(jsonPath("$.eventDate").value(DEFAULT_EVENT_DATE.toString()))
            .andExpect(jsonPath("$.howManyInstances").value(DEFAULT_HOW_MANY_INSTANCES.intValue()))
            .andExpect(jsonPath("$.cycleLength").value(DEFAULT_CYCLE_LENGTH.intValue()))
            .andExpect(jsonPath("$.cycleUnit").value(DEFAULT_CYCLE_UNIT.toString()))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.userlogin").value(DEFAULT_USERLOGIN));
    }

    @Test
    @Transactional
    void getNonExistingPublicEvent() throws Exception {
        // Get the publicEvent
        restPublicEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPublicEvent() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();

        // Update the publicEvent
        PublicEvent updatedPublicEvent = publicEventRepository.findById(publicEvent.getId()).get();
        // Disconnect from session so that the updates on updatedPublicEvent are not directly saved in db
        em.detach(updatedPublicEvent);
        updatedPublicEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .howManyInstances(UPDATED_HOW_MANY_INSTANCES)
            .cycleLength(UPDATED_CYCLE_LENGTH)
            .cycleUnit(UPDATED_CYCLE_UNIT)
            .category(UPDATED_CATEGORY)
            .userlogin(UPDATED_USERLOGIN);

        restPublicEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPublicEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPublicEvent))
            )
            .andExpect(status().isOk());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
        PublicEvent testPublicEvent = publicEventList.get(publicEventList.size() - 1);
        assertThat(testPublicEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testPublicEvent.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testPublicEvent.getHowManyInstances()).isEqualTo(UPDATED_HOW_MANY_INSTANCES);
        assertThat(testPublicEvent.getCycleLength()).isEqualTo(UPDATED_CYCLE_LENGTH);
        assertThat(testPublicEvent.getCycleUnit()).isEqualTo(UPDATED_CYCLE_UNIT);
        assertThat(testPublicEvent.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPublicEvent.getUserlogin()).isEqualTo(UPDATED_USERLOGIN);
    }

    @Test
    @Transactional
    void putNonExistingPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, publicEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publicEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publicEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publicEvent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePublicEventWithPatch() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();

        // Update the publicEvent using partial update
        PublicEvent partialUpdatedPublicEvent = new PublicEvent();
        partialUpdatedPublicEvent.setId(publicEvent.getId());

        partialUpdatedPublicEvent
            .eventName(UPDATED_EVENT_NAME)
            .cycleLength(UPDATED_CYCLE_LENGTH)
            .category(UPDATED_CATEGORY)
            .userlogin(UPDATED_USERLOGIN);

        restPublicEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublicEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublicEvent))
            )
            .andExpect(status().isOk());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
        PublicEvent testPublicEvent = publicEventList.get(publicEventList.size() - 1);
        assertThat(testPublicEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testPublicEvent.getEventDate()).isEqualTo(DEFAULT_EVENT_DATE);
        assertThat(testPublicEvent.getHowManyInstances()).isEqualTo(DEFAULT_HOW_MANY_INSTANCES);
        assertThat(testPublicEvent.getCycleLength()).isEqualTo(UPDATED_CYCLE_LENGTH);
        assertThat(testPublicEvent.getCycleUnit()).isEqualTo(DEFAULT_CYCLE_UNIT);
        assertThat(testPublicEvent.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPublicEvent.getUserlogin()).isEqualTo(UPDATED_USERLOGIN);
    }

    @Test
    @Transactional
    void fullUpdatePublicEventWithPatch() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();

        // Update the publicEvent using partial update
        PublicEvent partialUpdatedPublicEvent = new PublicEvent();
        partialUpdatedPublicEvent.setId(publicEvent.getId());

        partialUpdatedPublicEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .howManyInstances(UPDATED_HOW_MANY_INSTANCES)
            .cycleLength(UPDATED_CYCLE_LENGTH)
            .cycleUnit(UPDATED_CYCLE_UNIT)
            .category(UPDATED_CATEGORY)
            .userlogin(UPDATED_USERLOGIN);

        restPublicEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublicEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublicEvent))
            )
            .andExpect(status().isOk());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
        PublicEvent testPublicEvent = publicEventList.get(publicEventList.size() - 1);
        assertThat(testPublicEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testPublicEvent.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testPublicEvent.getHowManyInstances()).isEqualTo(UPDATED_HOW_MANY_INSTANCES);
        assertThat(testPublicEvent.getCycleLength()).isEqualTo(UPDATED_CYCLE_LENGTH);
        assertThat(testPublicEvent.getCycleUnit()).isEqualTo(UPDATED_CYCLE_UNIT);
        assertThat(testPublicEvent.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPublicEvent.getUserlogin()).isEqualTo(UPDATED_USERLOGIN);
    }

    @Test
    @Transactional
    void patchNonExistingPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, publicEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publicEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publicEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPublicEvent() throws Exception {
        int databaseSizeBeforeUpdate = publicEventRepository.findAll().size();
        publicEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicEventMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(publicEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PublicEvent in the database
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePublicEvent() throws Exception {
        // Initialize the database
        publicEventRepository.saveAndFlush(publicEvent);

        int databaseSizeBeforeDelete = publicEventRepository.findAll().size();

        // Delete the publicEvent
        restPublicEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, publicEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PublicEvent> publicEventList = publicEventRepository.findAll();
        assertThat(publicEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
