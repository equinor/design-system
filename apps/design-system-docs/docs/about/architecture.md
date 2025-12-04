# Architecture

Diagrams based on [C4Model](https://c4model.com)

## Context diagram

```mermaid
C4Context
    title Equinor Design System - Context

    Enterprise_Boundary(equinor, "Equinor") {

        Boundary(eds-system, "EDS Resources"){
            System(github_eds, "design-system", "The Public GitHub<br>repository for EDS")

        }
        Boundary(eds-users, "Users & Personas"){
            Person(Developer, "SW Engineer", "A software engineer of<br>front end software<br>for humans in Equinor")
            Person(Creator, "Content Creator", "A creator of content<br>for humans in Equinor")
            Person(Designer, "UI / UX Designer", "A designer that uses EDS<br>to design intefaces for<br>humans in Equinor")
        }
        Boundary(user-deliveies, "User deliveries") {
            Person(enduser_eds, "End user", "A human end-user<br>of software based on EDS")
            System(deliveries, "Front end", "Content / Applications<br>published in Equinor<br>based on EDS")
        }

        Boundary(eds-deliveries,"EDS Deliveries"){
            System_Ext(npm_eds,"NPM", "EDS react components")
            System(portal_eds, "Website", "eds.equinor.com")
            System_Ext(figma_eds, "Figma", "Equinor Workspace")
            System_Ext(cdn_eds, "CDN", "CDN for EDS")

        }
    }

        UpdateLayoutConfig($c4ShapeInRow="5", $c4BoundaryInRow="3")


        Rel(Designer, portal_eds, "Uses", "Reads documentation")
        BiRel(Designer, figma_eds, "Uses", "Designs UI<br>Creates prototypes<br>with EDS resources")

        Rel(Developer, portal_eds, "Uses", "Reads documentation")
        BiRel(Developer, github_eds, "Uses and collaborates", "Issue reporting<br>Feature requests")
        Rel(Developer, npm_eds, "Uses")

        BiRel(Creator, portal_eds, "Uses", "Reads documentation")

        Rel(deliveries, cdn_eds, "Refers")

        Rel(github_eds, cdn_eds, "Publishes Icons & Fonts", "GH Actions")
        Rel(github_eds, npm_eds, "Publishes React Library & Tokens", "GH Actions")
        Rel(github_eds, portal_eds, "Publishes Documentation", "GH Actions")

        Rel(enduser_eds, deliveries, "Uses")
```

## Container

### Figma

```mermaid
C4Context
    title Equinor Design System - Container
```

### Documentation Portal

```mermaid
C4Context
    title Equinor Design System - Container
```

## Components
