package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PublicEventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PublicEvent.class);
        PublicEvent publicEvent1 = new PublicEvent();
        publicEvent1.setId(1L);
        PublicEvent publicEvent2 = new PublicEvent();
        publicEvent2.setId(publicEvent1.getId());
        assertThat(publicEvent1).isEqualTo(publicEvent2);
        publicEvent2.setId(2L);
        assertThat(publicEvent1).isNotEqualTo(publicEvent2);
        publicEvent1.setId(null);
        assertThat(publicEvent1).isNotEqualTo(publicEvent2);
    }
}
