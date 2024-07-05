# Explore the Swift on Server ecosystem

Swift is a great language for writing your server applications, and powers critical services across Apple’s cloud products. We’ll explore tooling, delve into the Swift server package ecosystem, and demonstrate how to interact with databases and add observability to applications.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10216", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(dl-alexandre)
   }
}

## Presenter

*Franz Busch, Swift on Server Team*

## Key takeaways

- ⚡️ C-like performance
- 🤓 Low memory footprint
- 🤞 Safe and expressive - strong-typing, optionals, and memory safety
- 🧮 First-class concurrency features

## SSWG

The [Swift Server Workgroup](https://www.swift.org/sswg/) was founded in 2016 is the oldest of the workgroups.
- Defining and prioritizing efforts to address the needs of the server community
- Reducing duplication by incubating packages
- Increase Compatibility
- Promote best practices

## Server Package IDE's

- Xcode
- VSCode (Example)
- Neovim
- Any editor supporting Language Server Protocol

## Example Package

```swift
// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "EventService",
    platforms: [.macOS(.v14)],
    dependencies: [
        .package(
            url: "https://github.com/apple/swift-openapi-generator",
            from: "1.2.1"
        ),
        .package(
            url: "https://github.com/apple/swift-openapi-runtime",
            from: "1.4.0"
        ),
        .package(
            url: "https://github.com/vapor/vapor",
            from: "4.99.2"
        ),
        .package(
            url: "https://github.com/swift-server/swift-openapi-vapor",
            from: "1.0.1"
        ),
    ],  
    targets: [
        .target(
            name: "EventAPI",
            dependencies: [
                .product(
                    name: "OpenAPIRuntime",
                    package: "swift-openapi-runtime"
                ),
            ],
            plugins: [
                .plugin(
                    name: "OpenAPIGenerator",
                    package: "swift-openapi-generator"
                )
            ]
        ),
        .executableTarget(
            name: "EventService",
            dependencies: [
                "EventAPI",
                .product(
                    name: "OpenAPIRuntime",
                    package: "swift-openapi-runtime"
                ),
                .product(
                    name: "OpenAPIVapor",
                    package: "swift-openapi-vapor"
                ),
                .product(
                    name: "Vapor",
                    package: "vapor"
                ),
            ]  
        ),
    ]
)
```

The two targets of the Package are the `EventAPI` which has the OpenAPIGenerator plugin configured and the `EventService` executableTarget.

### Swift OpenAPI Generator 

service documentation in YAML

```yaml
openapi: "3.1.0"
info:
    title: "EventService"
    version: "1.0.0"
servers:
    - url: "https://localhost:8080/api"
        description: "Example service deployment."
paths:
    /events:
        get:
            operationId: "listEvents"
            responses:
                "200":
                    description: "A success response with all events."
                    content:
                        application/json:
                            schema:
                                type: "array"
                                items:
                                    $ref: "#/components/schemas/Event"
        post:
            operationId: "createEvent"
            requestBody:
                description: "The event to create."
                required: true
                content:
                    application/json:
                        schema:
                            $ref: '#/components/schemas/Event'
            responses:
                '201':
                    description: "A success indicating the event was created."
                '400':
                    description: "A failure indicating the event wasn't created."
components:
    schemas:
        Event:
            type: "object"
            description: "An event."
            properties:
                name:
                    type: "string"
                    description: "The event's name."
                date:
                    type: "string"
                    format: "date"
                    description: "The day of the event."
                attendee:
                    type: "string"
                    description: "The name of the person attending the event."
            required:
                - "name"
                - "date"
                - "attendee"
```

Defined are both operations in the events path. 
- The first operation is a get method called `listEvents`. The operation returns a success response containing an array of events. 
- The second operation is a post method called `createEvent`. This operation takes a JSON body of an event and depending if the creation was successful the operation returns a 201 or a 400 status code.

## Main Entry Point

```swift
import OpenAPIRuntime
import OpenAPIVapor
import Vapor
import EventAPI

@main
struct Service {
    static func main() async throws {
        let application = try await Vapor.Application.make()
        let transport = VaporTransport(routesBuilder: application)

        let service = Service()
        try service.registerHandlers(
            on: transport,
            serverURL: URL(string: "/api")!
        )

        try await application.execute()
    }
}
```

1. Vapor application
2. OpenAPI `VaporTransport` 
3. Instance of Service
4. Register Service with Trasport
5. Execute Vapor application - starting an HTTP server listening for incomming connections

```swift
extension Service: APIProtocol {
    func listEvents(
        _ input: Operations.listEvents.Input
    ) async throws -> Operations.listEvents.Output {
        let events: [Components.Schemas.Event] = [
            .init(name: "Server-Side Swift Conference", date: "26.09.2024", attendee: "Gus"),
            .init(name: "Oktoberfest", date: "21.09.2024", attendee: "Werner"),
        ]

        return .ok(.init(body: .json(events)))
    }

    func createEvent(
        _ input: Operations.createEvent.Input
    ) async throws -> Operations.createEvent.Output {
        return .undocumented(statusCode: 501, .init())
    }
}
```

Service implements generated APIProtocol
Array of Events returned by `listEvents` method
"Not Implemented" status code returned by `createEvent`

## Running Server

Upon running server your terminal will display
@Image(source: "WWDC24-10216-server-start-vscode")

List all events by querying service in another terminal using curl

```bash
curl -X GET "localhost:8080/api/events"
```

Returning

```json
[
    {
        "attendee" : "Gus"
        "date" : "26.09.2024"
        "name" : "Server-Side Swift Conference"
    },
    {
        "attendee" : "Werner"
        "date" : "21.09.2024"
        "name" : "Oktoberfest"
    }
]
```

## Database Drivers

- PostgreSQL 
- MySQL 
- Cassandra
- MongoDB
- Etc.

### PostgresNIO 1.21 

`PostgresClient` provides a completely new asynchronous interface and comes with a built-in connection pool which leverages structured concurrency, making it resilient against intermittent networking failures to the database. Additionally, the connection pool improves throughput by distributing queries over multiple connections and prewarming connections for faster query execution.

## Add Dependency to Package

```swift
// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "EventService",
    platforms: [.macOS(.v14)],
    dependencies: [
        ...
        Other Dependencies
        ...
        .package(
            url: "https://github.com/vapor/postgres-nio",
            from: "1.19.1"
        ),
    ],
    targets: [
        .target(
            name: "EventAPI",
            dependencies: [
                .product(
                    name: "OpenAPIRuntime",
                    package: "swift-openapi-runtime"
                ),
            ],
            plugins: [
                .plugin(
                    name: "OpenAPIGenerator",
                    package: "swift-openapi-generator"
                )
            ]
        ),
        .executableTarget(
            name: "EventService",
            dependencies: [
                "EventAPI",
                ...
                Other Dependencies
                ...
                .product(
                    name: "PostgresNIO",
                    package: "postgres-nio"
                ),
            ]
        ),
    ]
)
```
## Add property to service

```swift
...
Other imported frameworks
...
import PostgresNIO

@main
struct Service {
    let postgresClient: PostgresClient

    static func main() async throws {
        let application = try await Vapor.Application.make()
        let transport = VaporTransport(routesBuilder: application)

        let postgresClient = PostgresClient(
            configuration: .init(
                host: "localhost",
                username: "postgres",
                password: nil,
                database: nil,
                tls: .disable
            )
        )
        let service = Service(postgresClient: postgresClient)
        try service.registerHandlers(
            on: transport,
            serverURL: URL(string: "/api")!
        )

        try await withThrowingDiscardingTaskGroup { group in
            group.addTask {
                await postgresClient.run()
            }

            group.addTask {
                try await application.execute()
            }
        }
    }
}

extension Service: APIProtocol {
    func listEvents(
        _ input: Operations.listEvents.Input
    ) async throws -> Operations.listEvents.Output {
        let rows = try await self.postgresClient.query("SELECT name, date, attendee FROM events")

        var events = [Components.Schemas.Event]()
        for try await (name, date, attendee) in rows.decode((String, String, String).self) {
            events.append(.init(name: name, date: date, attendee: attendee))
        }

        return .ok(.init(body: .json(events)))
    }

    func createEvent(
        _ input: Operations.createEvent.Input
    ) async throws -> Operations.createEvent.Output {
        return .undocumented(statusCode: 501, .init())
    }
}
```

1. Import PostgresNIO
2. Add `PostgresClient` property
3. Return an AsyncSequence of rows by using the client to query the database in the listEvents method
4. Replace the hard coded list of events by
    1. Iterating over the rows 
    2. Decoding the fields 
    3. Creating an event for each row

The AsyncSequence returned by the query method will automatically prefetch rows from the database speeding up performance. 

5. Create a PostgresClient
6. Pass database to Service
7. Create discarding task group
8. Add child task that runs PostgresClient
9. Move Vapor application execution into separate child task

## Create Event Method

```swift
func createEvent(
    _ input: Operations.createEvent.Input
) async throws -> Operations.createEvent.Output {
    switch input.body {
    case .json(let event):
        try await self.postgresClient.query(
            """
            INSERT INTO events (name, date, attendee)
            VALUES (\(event.name), \(event.date), \(event.attendee))
            """
        )
        return .created(.init())
    }
}
```

1. switch over the input 
2. extract the JSON event
3. query the database inserting new event
4. return created event



## Mitigating SQL injection

```swift
var query = PostgresQuery(
    """
    INSERT INTO events (name, date, attendee)
    VALUES ($0, $1, $2)
    """
)

query.binds.append(event.name)
query.binds.append(event.date)
query.binds.append(event.attendee)
```

Note: Even though this looks like a string it isn't a string, but uses Swift's String interpolation feature to transform the string query into a parameterised query with value binding. Making it completely safe from SQL injection attacks.

## Restarting

@Image(source: "WWDC24-10216-server-start-vscode")

Again use curl to create two events

```bash
curl -X POST "localhost:8080/api/events" \
-H "Content-Type: application/json" \
-d '{"name": "Oktoberfest", "date": "21.09.2024", "attendee": "Werner"}'
```

```bash
curl -X POST "localhost:8080/api/events" \
-H "Content-Type: application/json" \
-d '{"name": "Server-Side Swift Conference", "date": "26.09.2024", "attendee": "Gus"}'
```

Then view events
List all events by querying service in another terminal using curl

```bash
curl -X GET "localhost:8080/api/events"
```

Returning

```json
[
    {
        "attendee" : "Gus"
        "date" : "26.09.2024"
        "name" : "Server-Side Swift Conference"
    },
    {
        "attendee" : "Werner"
        "date" : "21.09.2024"
        "name" : "Oktoberfest"
    }
]
```

# Adding Duplicate Entry

```bash
curl -X POST "localhost:8080/api/events" \
-H "Content-Type: application/json" \
-d '{"name": "Server-Side Swift Conference", "date": "26.09.2024", "attendee": "Gus"}'
```

When entered the database returns an error

@Image(source: "WWDC24-10216-server-ambiguous-error")

The description of PSQLError intentionally omits detailed information to prevent accidental leakage of database information such as the schemas of your table. Use observability to assist troubleshooting.

## Observability

- **Logging** - Helps understanding exactly what a service did and allows digging into the detail
- **Metrics** - Allow a high level overview of service health at a glance
- **Tracing** - Helps understanding what path a single request took through system

## Troubleshooting

```swift
func listEvents(
    _ input: Operations.listEvents.Input
) async throws -> Operations.listEvents.Output {
    let logger = Logger(label: "ListEvents")
    logger.info("Handling request", metadata: ["operation": "\(Operations.listEvents.id)"])

    Counter(label: "list.events.counter").increment()

    return try await withSpan("database query") { span in
        let rows = try await postgresClient.query("SELECT name, date, attendee FROM events")
        return try await .ok(.init(body: .json(decodeEvents(rows))))
    }
}
```

1. Use `swift-log` to emit a log when handling a new listEvents request. `swift-log` supports structured logging by adding metadata to log messages providing additional context when troubleshooting problems.
2. Add a counter from `swift-metrics` that increments on each request to track how many requests the service has processed. 
3. Add `swift-distributed-tracing` creating a span around database query, which helps while troubleshooting a request end to end through system.

## Bootstrapping

The Swift on Server ecosystem contains many different backends for logging, metrics and distributed tracing. Choosing the backends is done by calling the bootstrapping methods of the three libraries. Bootstrapping should only be done in executables and should happen as early as possible (`main()`) to ensure no observability event is lost.

LoggingSystem
```swift
LoggingSystem.bootstrap(StreamLogHandler.standardError)
```

MetricSystem - [Prometheus](https://github.com/swift-server/swift-prometheus)
```swift
let registry = PrometheusCollectiorRegistry()
MetricSystem.bootstrap(PrometheusMetricsFactory(registry: registry))
```

InstrumentationSystem - [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-swift)
```swift
let otelTracer = Otel.Tracer(...)
InstrmentationSystem.bootstrap(otelTracer)
```

## Logging Methods

Add Logging

```swift
.package(
    url: "https://github.com/apple/swift-log",
    from: "1.5.4"
),
```

```swift
.product(
    name: "Logging",
    package: "swift-log"
),
```

```swift
func createEvent(
    _ input: Operations.createEvent.Input
) async throws -> Operations.createEvent.Output {
    switch input.body {
    case .json(let event):
        do {
        try await self.postgresClient.query(
            """
            INSERT INTO events (name, date, attendee)
            VALUES (\(event.name), \(event.date), \(event.attendee))
            """
            )
            return .created(.init())
        } catch let error as PSQLError {
            let logger = Logger(label: "CreateEvent")

            if let message = error.serverInfo?[.message] {
                logger.info(
                    "Failed to create event",
                    metadata: ["error.message": "\(message)"]
                )
            }

            return .badRequest(.init())
        }
    }
}
```

1. Import the Logging module
2. Catch the errors thrown by the query method - The query method throws a PSQLError in the case something went wrong when executing the query.
3. Create a logger
4. Extract the error message 
5. Emit the log
The PSQLError contains detailed information about what went wrong in the serverInfo property.
6. Return a badRequest response

New Error
@Image(source: "WWDC24-10216-server-duplicate-key-error")

## Swift on Server Example Libraries

- Metrics
- PostgresNIO
- Vapor
- StatsClient
- Hummingbird
- AsyncHTTPClient
- MongoKitten
- OTel
- Smoke
- SQLiteNIO
- GraphQL
- DataDogLog
- Tracing
- StackdriverLogging
- Puppy
- MQTTNIO
- Crypto
- X509
- Protobuf
- BSON
- MySQLNIO
- NIO
- ASN1
- OpenAPI Generator
- CassandraClient
- Prometheus
- OracleNIO
- Soto
- DiscordBM
- GRPC
- RediStack
- KafkaClient
- DistributedCluster
- Logging
- MongoSwift
- APNSwift
- Citadel
- Graphiti

## Package Locations

- Swift.org [packages](https://www.swift.org/packages/)
- [Swift Package Index](https://swiftpackageindex.com)
- SSWG Incubation [List](https://www.swift.org/sswg/#projects)


