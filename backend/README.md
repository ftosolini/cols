# QRCols Backend
Backend server of QRCols
## Dependencies

- [Nest](https://github.com/nestjs/nest) framework
- TypeOrm
- openApi

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## UML Diagram

```mermaid
classDiagram
  App "n" <-- "n" User
  App "1" <-- "n" Point
  App "1" <-- "n" Route
  Point "n" --> "n" Route
  App "1" <-- "n" Definition
  Definition "1" --> "n" Point
  Definition "1" --> "n" PropertyDefinition
  PropertyDefinition "1" --> "n" PropertyDefinition
  
  class App {
    +id: string
    +name: string
    +logo: string
    +tileUrl: string
  }
  
  class User {
    +id: string
    +firstName: string
    +lastName: string
    +email: string
    +password: string
    +role: admin | user
    -fullname(): string
  }
  
  class Point {
    +id: string
    +name: string
    +latitude: number
    +longitude: number
    +type: string
    +properties: Object
  }
  
  class Definition {
    +id: string
    +name: string
    +description: string
    +icon: string
  }
  
  class Route {
    +id: string
    +name: string
    +startDate: Date
    +endDate: Date
    +trace: gpx
    +rewardIcon: string
  }
  
  class PropertyDefinition {
    +id: string
    +name: string
    +type: PropertyType
  }
  
  class PropertyType {
    <<enumeration>>
    STRING
    BOOLEAN
    NUMBER
    DATE
    OBJECT
    LIST
  }
```
