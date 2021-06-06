package com.headempty.xd365calendar.domain;

import com.headempty.xd365calendar.domain.enumeration.Category;
import com.headempty.xd365calendar.domain.enumeration.TimeUnits;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "event_name", length = 30, nullable = false)
    private String eventName;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @NotNull
    @Column(name = "event_end_date", nullable = false)
    private Instant eventEndDate;

    @NotNull
    @Min(value = 1L)
    @Max(value = 10000L)
    @Column(name = "how_many_instances", nullable = false)
    private Long howManyInstances;

    @Min(value = 1L)
    @Max(value = 10000L)
    @Column(name = "cycle_length")
    private Long cycleLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "cycle_unit")
    private TimeUnits cycleUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

    @Size(max = 250)
    @Column(name = "description", length = 250)
    private String description;

    @Column(name = "userlogin")
    private String userlogin;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event id(Long id) {
        this.id = id;
        return this;
    }

    public String getEventName() {
        return this.eventName;
    }

    public Event eventName(String eventName) {
        this.eventName = eventName;
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Instant getEventDate() {
        return this.eventDate;
    }

    public Event eventDate(Instant eventDate) {
        this.eventDate = eventDate;
        return this;
    }

    public void setEventDate(Instant eventDate) {
        this.eventDate = eventDate;
    }

    public Instant getEventEndDate() {
        return this.eventEndDate;
    }

    public Event eventEndDate(Instant eventEndDate) {
        this.eventEndDate = eventEndDate;
        return this;
    }

    public void setEventEndDate(Instant eventEndDate) {
        this.eventEndDate = eventEndDate;
    }

    public Long getHowManyInstances() {
        return this.howManyInstances;
    }

    public Event howManyInstances(Long howManyInstances) {
        this.howManyInstances = howManyInstances;
        return this;
    }

    public void setHowManyInstances(Long howManyInstances) {
        this.howManyInstances = howManyInstances;
    }

    public Long getCycleLength() {
        return this.cycleLength;
    }

    public Event cycleLength(Long cycleLength) {
        this.cycleLength = cycleLength;
        return this;
    }

    public void setCycleLength(Long cycleLength) {
        this.cycleLength = cycleLength;
    }

    public TimeUnits getCycleUnit() {
        return this.cycleUnit;
    }

    public Event cycleUnit(TimeUnits cycleUnit) {
        this.cycleUnit = cycleUnit;
        return this;
    }

    public void setCycleUnit(TimeUnits cycleUnit) {
        this.cycleUnit = cycleUnit;
    }

    public Category getCategory() {
        return this.category;
    }

    public Event category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getDescription() {
        return this.description;
    }

    public Event description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserlogin() {
        return this.userlogin;
    }

    public Event userlogin(String userlogin) {
        this.userlogin = userlogin;
        return this;
    }

    public void setUserlogin(String userlogin) {
        this.userlogin = userlogin;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", eventName='" + getEventName() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            ", eventEndDate='" + getEventEndDate() + "'" +
            ", howManyInstances=" + getHowManyInstances() +
            ", cycleLength=" + getCycleLength() +
            ", cycleUnit='" + getCycleUnit() + "'" +
            ", category='" + getCategory() + "'" +
            ", description='" + getDescription() + "'" +
            ", userlogin='" + getUserlogin() + "'" +
            "}";
    }
}
