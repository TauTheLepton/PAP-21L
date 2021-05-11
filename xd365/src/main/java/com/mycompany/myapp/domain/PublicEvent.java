package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Category;
import com.mycompany.myapp.domain.enumeration.TimeUnits;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PublicEvent.
 */
@Entity
@Table(name = "public_event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PublicEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "event_name", nullable = false)
    private String eventName;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @NotNull
    @Min(value = 1L)
    @Column(name = "how_many_instances", nullable = false)
    private Long howManyInstances;

    @Min(value = 1L)
    @Column(name = "cycle_length")
    private Long cycleLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "cycle_unit")
    private TimeUnits cycleUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PublicEvent id(Long id) {
        this.id = id;
        return this;
    }

    public String getEventName() {
        return this.eventName;
    }

    public PublicEvent eventName(String eventName) {
        this.eventName = eventName;
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getEventDate() {
        return this.eventDate;
    }

    public PublicEvent eventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
        return this;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Long getHowManyInstances() {
        return this.howManyInstances;
    }

    public PublicEvent howManyInstances(Long howManyInstances) {
        this.howManyInstances = howManyInstances;
        return this;
    }

    public void setHowManyInstances(Long howManyInstances) {
        this.howManyInstances = howManyInstances;
    }

    public Long getCycleLength() {
        return this.cycleLength;
    }

    public PublicEvent cycleLength(Long cycleLength) {
        this.cycleLength = cycleLength;
        return this;
    }

    public void setCycleLength(Long cycleLength) {
        this.cycleLength = cycleLength;
    }

    public TimeUnits getCycleUnit() {
        return this.cycleUnit;
    }

    public PublicEvent cycleUnit(TimeUnits cycleUnit) {
        this.cycleUnit = cycleUnit;
        return this;
    }

    public void setCycleUnit(TimeUnits cycleUnit) {
        this.cycleUnit = cycleUnit;
    }

    public Category getCategory() {
        return this.category;
    }

    public PublicEvent category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PublicEvent)) {
            return false;
        }
        return id != null && id.equals(((PublicEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PublicEvent{" +
            "id=" + getId() +
            ", eventName='" + getEventName() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            ", howManyInstances=" + getHowManyInstances() +
            ", cycleLength=" + getCycleLength() +
            ", cycleUnit='" + getCycleUnit() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
