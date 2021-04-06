package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Category;
import com.mycompany.myapp.domain.enumeration.YesNo;
import java.io.Serializable;
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
    @Column(name = "event_name", nullable = false)
    private String eventName;

    @NotNull
    @Column(name = "event_day", nullable = false)
    private Long eventDay;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "is_cyclical", nullable = false)
    private YesNo isCyclical;

    @Column(name = "cycle_length")
    private Long cycleLength;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "is_public", nullable = false)
    private YesNo isPublic;

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

    public Long getEventDay() {
        return this.eventDay;
    }

    public Event eventDay(Long eventDay) {
        this.eventDay = eventDay;
        return this;
    }

    public void setEventDay(Long eventDay) {
        this.eventDay = eventDay;
    }

    public YesNo getIsCyclical() {
        return this.isCyclical;
    }

    public Event isCyclical(YesNo isCyclical) {
        this.isCyclical = isCyclical;
        return this;
    }

    public void setIsCyclical(YesNo isCyclical) {
        this.isCyclical = isCyclical;
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

    public YesNo getIsPublic() {
        return this.isPublic;
    }

    public Event isPublic(YesNo isPublic) {
        this.isPublic = isPublic;
        return this;
    }

    public void setIsPublic(YesNo isPublic) {
        this.isPublic = isPublic;
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
            ", eventDay=" + getEventDay() +
            ", isCyclical='" + getIsCyclical() + "'" +
            ", cycleLength=" + getCycleLength() +
            ", isPublic='" + getIsPublic() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
