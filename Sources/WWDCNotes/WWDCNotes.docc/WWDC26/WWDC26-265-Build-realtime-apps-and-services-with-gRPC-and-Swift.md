# Build real-time apps and services with gRPC and Swift

Build engaging live experiences with gRPC in your Swift app and backend. gRPC is an open-source RPC framework designed for high-performance, bidirectional streaming APIs. Explore how the gRPC Swift package provides a modern, safe runtime built with Swift concurrency. Learn how integrated tools streamline your workflow and help you deliver real-time features with ease.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/265", purpose: link, label: "Watch Video (24 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary

- **gRPC Swift** simplifies app-to-server communication with generated code from specifications, reducing errors and development time.
- Deploy gRPC services to the cloud for scalable real-time experiences.
- Supports unary, client, server, and bidirectional streaming RPCs for dynamic app interactions.

@Image(source: "WWDC26-265-grpc.jpeg", alt: "gRPC function call with Request -> Function -> Response")

## Presenters

- George Barnett, Swift Server

## What is gRPC?

- **gRPC**: A framework for remote procedure calls, widely adopted and part of the CNCF (Cloud Native Computing Foundation).
- **Specification-Based**: APIs are defined using protocol buffers (protobuf), enabling code generation for interactions.

## Benefits

- **Code Generation**: Saves development time and reduces errors.
- **Streaming Support**: Supports unary, client streaming, server streaming, and bidirectional streaming RPCs.

## Implementing gRPC in an App

### Setting Up

1. **Define Service API**: Use `.proto` file to define services and messages.
2. **Add Dependencies**: Include `gRPC Swift NIO transport` and `gRPC Swift Protobuf` in Xcode.
   - <https://github.com/grpc/grpc-swift-nio-transport>
   - <https://github.com/grpc/grpc-swift-protobuf>
3. **Generate Code**: Configure and run the gRPC build plugin to generate client code.

### Code Examples

```proto
// swift_kart_service.proto

edition = "2024";

import "google/protobuf/duration.proto";
import "google/protobuf/timestamp.proto";

service SwiftKartService {
  rpc ListRaces(ListRacesRequest) returns (ListRacesResponse);
  rpc FollowRace(stream FollowRaceRequest) returns (stream FollowRaceResponse);
}

message ListRacesRequest {
  int32 limit = 1 [default = 100];
}

message ListRacesResponse {
  repeated Race races = 1;
}

message Race {
  string name = 1;
  string location = 2;
  google.protobuf.Timestamp start_time = 3;
  int32 laps = 4;
  string championship = 5;
  repeated string drivers = 6;
}

message FollowRaceRequest {
  string race_name = 1;
  repeated RaceEventType event_types = 2;
}

enum RaceEventType {
  RACE_EVENT_TYPE_UNSPECIFIED = 0;
  RACE_EVENT_TYPE_KART_LOCATIONS = 1;
  RACE_EVENT_TYPE_STANDINGS = 2;
}

message FollowRaceResponse {
  oneof event {
    KartLocations locations = 1;
    Standings standings = 2;
  }
}

message KartLocations {
  message Kart {
    int32 number = 1;
    double latitude = 2;
    double longitude = 3;
    google.protobuf.Timestamp recorded_at = 4;
  }
  repeated Kart karts = 1;
}

message Standings {
  message Entry {
    int32 kart_number = 1;
    google.protobuf.Duration gap_to_leader = 2;
    int32 position = 3;
    int32 lap = 4;
  }

  repeated Entry entries = 1;
}
```

### Client-Side Implementation

- **Create Client Manager**: Manage connections and reuse clients across views.
- **Handle Streaming**: Use async sequences and task groups for streaming RPCs.

```swift
// ClientManager.swift  

import GRPCCore
import GRPCNIOTransportHTTP2
import Synchronization
import SwiftUI

@Observable
final class ClientManager: Sendable {
    fileprivate let state = Mutex(State.disconnected)

    static func makeTransport() throws -> HTTP2ClientTransport.TransportServices {
       try .http2NIOTS(
          target: .dns(host: "wwdc-demo-server-863666503339.us-central1.run.app"),
          transportSecurity: .tls
       )
    }

    // static func makeTransport() throws -> HTTP2ClientTransport.TransportServices {
    //     try .http2NIOTS(
    //         target: .ipv4(address: "127.0.0.1", port: 8080),
    //         transportSecurity: .plaintext
    //     )
    // }

    func withClient(
        body: (_ client: GRPCClient<HTTP2ClientTransport.TransportServices>) async throws -> Void
    ) async throws {
        let client = try connectIfNecessary()
        try await body(client)
    }

    private func connectIfNecessary() throws -> GRPCClient<HTTP2ClientTransport.TransportServices> {
        try self.state.withLock { state in
            try state.connectIfNecessary()
        }
    }

    func disconnect() {
        let client = self.state.withLock { state in
            state.disconnect()
        }

        client?.beginGracefulShutdown()
    }
}

extension ClientManager {
    enum State {
        case connected(GRPCClient<HTTP2ClientTransport.TransportServices>, Task<Void, any Error>)
        case disconnected
    }
}

extension ClientManager.State {
    mutating func connectIfNecessary() throws -> GRPCClient<HTTP2ClientTransport.TransportServices> {
        switch self {
        case .connected(let client, _):
            return client

        case .disconnected:
            let client = try GRPCClient(transport: ClientManager.makeTransport())
            let task = Task { try await client.runConnections() }
            self = .connected(client, task)
            return client
        }
    }

    mutating func disconnect() -> GRPCClient<HTTP2ClientTransport.TransportServices>? {
        switch self {
        case .connected(let client, _):
            self = .disconnected
            return client
        case .disconnected:
            return nil
        }
    }
}
```

```swift
// LiveStreamView.swift

import SwiftUI
import GRPCCore
import GRPCNIOTransportHTTP2
import SwiftProtobuf

struct LiveStreamView: View {
    private let race: RaceInfo

    @Environment(ClientManager.self) var manager
    @State private var tracking: KartTrackingViewModel
    @State private var standings: [StandingsEntry] = []
    @State private var showLeaderboard = false
    @State private var continuation: AsyncStream<Bool>.Continuation?

    init(race: RaceInfo) {
        self.race = race
        self.tracking = KartTrackingViewModel(race: race)
    }

    var body: some View {
        VStack {
            KartTrackingMapView(viewModel: tracking)
                .ignoresSafeArea()
                .onAppear { tracking.start() }
                .onDisappear { tracking.stop() }
        }
        .onChange(of: showLeaderboard) { _, newValue in
            continuation?.yield(newValue)
        }
        .sheet(isPresented: $showLeaderboard) {
            LeaderboardView(race: race, standings: standings)
                .presentationDetents([.fraction(0.3), .medium, .large])
                .presentationBackgroundInteraction(.enabled)
        }
        .toolbar {
            Toggle(isOn: $showLeaderboard) {
                Label("Leaderboard", systemImage: "list.number")
            }
        }
        .toolbarBackgroundVisibility(.visible, for: .navigationBar)
        .task {
            do {
                let (stream, continuation) = AsyncStream.makeStream(of: Bool.self)
                self.continuation = continuation
                continuation.yield(showLeaderboard)

                try await manager.withClient { client in
                    let kart = SwiftKartService.Client(wrapping: client)
                    try await kart.followRace { requestStream in
                        for await showLeaderboard in stream {
                            var message = FollowRaceRequest()
                            message.raceName = race.name
                            message.eventTypes = [.kartLocations]
                            if showLeaderboard {
                                message.eventTypes.append(.standings)
                            }
                            try await requestStream.write(message)
                        }
                    } onResponse: { responseStream in
                        for try await message in responseStream.messages {
                            if let event = message.event {
                                await handleEvent(event)
                            }
                        }
                    }

                }
            } catch {
                print("gRPC error: \(error)")
            }
        }
    }

    @MainActor
    private func handleEvent(_ event: FollowRaceResponse.OneOf_Event) {
        switch event {
        case .locations(let locations):
            self.tracking.updateKartCoordinates(
                locations.karts.map {
                    TrackedKart(number: $0.number, latitude: $0.latitude, longitude: $0.longitude)
                }
            )
        case .standings(let standings):
            self.standings = standings.entries.map {
                StandingsEntry(
                    kartNumber: $0.kartNumber,
                    secondsToLeader: $0.gapToLeader.timeInterval,
                    position: $0.position,
                    lap: $0.lap
                )
            }
        }
    }
}
```

### Server-Side Implementation

- **Create Server Object**: Initialize with a transport and define services to offer.
- **Implement RPCs**: Use async functions to handle requests and return responses.
- **Streaming RPCs**: Manage request and response streams using task groups and async sequences.

```swift
// main.swift

let server = GRPCServer(
    transport: .http2NIOPosix(
        address: .ipv4(host: "127.0.0.1", port: 8080),
        transportSecurity: .plaintext
    ),
    services: [Service()]
)
try await server.serve()
```

```swift
// Service.swift

struct Service: SwiftKartService.SimpleServiceProtocol {
   private let database = RaceDB()

   func listRaces(
      request: ListRacesRequest,
      context: ServerContext
   ) async throws -> ListRacesResponse {
      var response = ListRacesResponse()
      response.races = await database.listRaces(atMost: request.limit)
      return response
   }

   func followRace(
      request: RPCAsyncSequence<FollowRaceRequest, any Error>,
      response: RPCWriter<FollowRaceResponse>,
      context: ServerContext
   ) async throws {
      try await withThrowingTaskGroup { group in
         var iterator = request.makeAsyncIterator()
         guard let first = try await iterator.next() else { return }
         let eventTypes = Mutex(Set(first.eventTypes))

         group.addTask {
               let events = tracker.events(forRace: first.raceName).filter { event in
                  eventTypes.withLock { $0.contains(event.type) }
               }

               for await event in events {
                  var message = FollowRaceResponse()
                  switch event {
                  case .locations(let locations):
                     message.locations.karts = locations.map { location in
                           var kart = KartLocations.Kart()
                           kart.number = Int32(location.number)
                           kart.latitude = location.latitude
                           kart.longitude = location.longitude
                           return kart
                     }
                  case .standings(let standings):
                     message.standings.entries = standings.map { standing in
                           var entry = Standings.Entry()
                           entry.gapToLeader = .init(rounding: standing.delta, rule: .towardZero)
                           entry.kartNumber = Int32(standing.kartNumber)
                           entry.lap = Int32(standing.lap)
                           entry.position = Int32(standing.position)
                           return entry
                     }
                  }

                  try await response.write(message)
               }
         }

         while let next = try await iterator.next() {
               eventTypes.withLock { $0 = Set(next.eventTypes) }
         }

         group.cancelAll()
      }
   }
}
```

### Deployment

- **Containerization**: Use Swift's Docker images for building and deploying to cloud platforms like Google Cloud.

```dockerfile
# Containerfile

FROM swift:latest AS builder

# Copy sources into /app
WORKDIR /app
COPY Package.swift Package.resolved .
COPY Sources/ Sources/

# Build the server
RUN swift build -c release --product server
RUN cp "$(swift build -c release --show-bin-path)/server" /usr/bin/server

# Copy the binary from the builder into a smaller runtime image.
FROM swift:slim
COPY --from=builder /usr/bin/server /usr/bin/server

EXPOSE 8080
ENTRYPOINT ["/usr/bin/server"]
```

```bash
gcloud run deploy wwdc-demo-server \
  --image us-central1-docker.pkg.dev/wwdc26/wwdc-demo-server/wwdc-demo-server:latest \
  --region us-central1 \
  --use-http2 \
  --allow-unauthenticated
```

## Use Cases

- **Real-Time Updates**: Stream data for live race updates.
- **Cloud Deployment**: Make services available to a broader audience.

@Image(source: "WWDC26-265-grpc-examples.jpeg", alt: "gRPC Examples. Apple Container, Private Cloud Compute, iCloud, SharePlay, internal infrastructure")

## Conclusion

- **Scalability & Efficiency**: gRPC Swift provides a robust solution for building scalable, real-time applications with efficient network communication.
