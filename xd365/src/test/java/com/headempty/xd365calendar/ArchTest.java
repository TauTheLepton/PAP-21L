package com.headempty.xd365calendar;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.headempty.xd365calendar");

        noClasses()
            .that()
            .resideInAnyPackage("com.headempty.xd365calendar.service..")
            .or()
            .resideInAnyPackage("com.headempty.xd365calendar.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.headempty.xd365calendar.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
