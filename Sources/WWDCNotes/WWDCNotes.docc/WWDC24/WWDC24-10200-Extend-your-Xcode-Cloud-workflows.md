# Extend your Xcode Cloud workflows

Discover how Xcode Cloud can adapt to your development needs. We’ll show you how to streamline your workflows, automate testing and distribution with start conditions, custom aliases, custom scripts, webhooks, and the App Store Connect API.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10200", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(dl-alexandre)
   }
}

## Key takeaways

- ☁️ Continuous Integration
- 🚂 Delivery
- 🤖 Built into Xcode
- 🎟️ Available on App Store Connect
- 🏎️ Accelerates Development
- 🌪️ Cloud-based
- 🔨 Builds Apps
- ✔️ Run automated tests
- 🛫 Deliver Apps to Testers
- 💬 Manage user feedback

## Presenters

*Daniel Yount, Xcode Engineer*
*Colin Dignazio, Xcode Cloud Engineer*

## Workflow

1. Environment 
    - Decide which Xcode and macOS version
2. Start Conditions 
    - when a workflow runs
        - Source control events
            - Branch Update
            - Pull Request
            - git Tag update
        - Schedule
        - Manually
3. Build Actions
    - What Xcode Cloud does with source code
        - Build apps
        - Run Tests
        - Analyze
        - Archive for distribution
4. Post Actions
    - What happens after build actions complete
        - Slack notifications

## Manually Configuring Test only Workflows

Access workflows by a secondary click on app in the Cloud reports navigator
@Image(source: "WWDC24-10200-manage-workflows")

Duplicate by a secondary click on existing workflow
@Image(source: "WWDC24-10200-duplicate-workflows")

- Rename workflow
- Add manual start condition

@Image(source: "WWDC24-10200-manual-start-condition")

- Change Test Action to run IntegrationTests test plan

@Image(source: "WWDC24-10200-test-action")

- Remove Post Action

@Image(source: "WWDC24-10200-remove-post-action")

## Custom Aliases

- New in Xcode 15.3
- Latest Release - workflow runs on latest version
- Workflows run using version of Xcode or macOS specified in the alias
    - updating alias updates all of workflows using it

1. Access Custom Alias by a secondary click on the App in the Cloud Navigator

@Image(source: "WWDC24-10200-custom-aliases")

2. Create new alias using the plus button

@Image(source: "WWDC24-10200-new-xcode-alias")

3. Give alias a name
4. Select Xcode Version

5. Repeat for a macOS alias

6. Configure workflow to use alias in Environment Tab

Quickly create and manage Custom Aliases from the version selector drop down menu or from the Integrations menu item

## Custom Scripts

- Define custom scripts inside repository
    - Cloning
    - before xcodebuild
    - after xcodebuild

@Image(source: "WWDC24-10200-custom-script-variables")

- All environment variables defined in your workflow, as well as environment variables provided by Xcode Cloud are available to use in these scripts.
- Xcode Cloud expects all custom scripts to be in a folder called ci_scripts in the root of project.

@Image(source: "WWDC24-10200-custom-script")

- The script’s file name determines the point in the build when it will be executed.

```bash
set -e

if [[ $CI_XCODEBUILD_ACTION == "test-without-building" && $CI_WORKFLOW_ID == "82D89C93-B69C-46B5-A794-A2BCFD3EE487" ]]
then
curl https://example.com/health --fail
fi
```

1. Checks for the test build action
2. Checks workflow matches an identifier

@Image(source: "WWDC24-10200-copy-workflow-id")

3. Call server's health check endpoint using curl
    - print detailed error logs on failure
    - setting `-e` exits script immediately if error is encountered

Xcode Cloud builds run on ephemeral task workers, the range of IP addresses that the host uses will vary.

4. Add required IP address ranges to server’s firewall’s inbound allowlist
    - Specifics on which IP address to allow available in 

 [Requirements for using Xcode Cloud]("https://developer.apple.com/documentation/xcode/requirements-for-using-xcode-cloud")

## Connecting outside of Xcode Cloud

- Use App Store Connect API to automatically start a build whenever test server has new changes.
    
 [Xcode Cloud Workflows and Builds]("https://developer.apple.com/documentation/appstoreconnectapi/xcode_cloud_workflows_and_builds")   

- Create new Xcode Cloud builds using `.ciBuildRuns` endpoint
    - workflow identifiers
    - Branch `gitReference` 
- Calling `scmRepositories` endpoint using a `repositoryID` fetches all branches, tags, and pull requests
- Query the `repositoryID` using CiWorkflows.

@Image(source: "WWDC24-10200-connecting-outside-of-xcode-cloud")

```swift
extension Client {
    func repoID(workflowID: String) async throws -> String {
        return try await ciWorkflowsGetInstance(
            path: .init(id: workflowID),
            query: .init(include: [.repository])
        ).ok.body.json.data.relationships!.repository!.data!.id
    }

    func branchID(repoID: String, name: String) async throws -> String {
        return try await scmRepositoriesGitReferencesGetToManyRelated(
            path: .init(id: repoID)
        )
        .ok.body.json.data
        .filter { $0.attributes!.kind == .BRANCH &&     $0.attributes!.name == name }
        .first!.id
    }

    func startBuild(workflowID: String, gitReferenceID: String) async throws {
        _ = try await ciBuildRunsCreateInstance(
            body: .json(.init(
                data: .init(
                    _type: .ciBuildRuns,
                    relationships: .init(
                        workflow: .init(data: .init(
                            _type: .ciWorkflows,
                            id: workflowID
                        )),
                        sourceBranchOrTag: .init(data: .init(
                            _type: .scmGitReferences,
                            id: gitReferenceID
                        ))
                    )
                )
            ))
        ).created
    }
}
```

1. `workflowID` as parameter
2. Fetch `ciWorkflow` resource
3. Return `repositoryID`
4. Fetch `gitReferences` using `scmRepositories`
5. Return `gitReferenceID`
6. Pass `workflowID` and `gitReferenceID` to `ciBuildRuns`


```swift
static func main() async throws {
    let client = try Client(
        serverURL: Servers.server1(),
        configuration: .init(dateTranscoder: .iso8601WithFractionalSeconds),
        transport: URLSessionTransport(),
        middlewares: [AuthMiddleware(token: ProcessInfo.processInfo.environment["TOKEN"]!)]
    )

    let workflowID = "82D89C93-B69C-46B5-A794-A2BCFD3EE487"
    let repoID = try await client.repoID(workflowID: workflowID)

    let branchName = "main"
    let branchID = try await client.branchID(repoID: repoID, name: branchName)

    try await client.startBuild(workflowID: workflowID, gitReferenceID: branchID)
}
```

1. Call `repoID` functions with the `workflowID`
2. Call `branchID` with the name of branch
3. Call `startBuld` using `workflowID` and `gitReferenceID`

Builds started by the App Store Connect API are considered manual

## Xcode Cloud Webhooks

- Allow services to respond to build events
- Only need an HTTP server

[Configuring webhooks in Xcode Cloud]("https://developer.apple.com/documentation/xcode/configuring-webhooks-in-xcode-cloud")

When configuring a webhook, Xcode Cloud will send requests containing a JSON payload with detailed information about different build events.

```swift
struct WebhookPayload: Content {
    let ciWorkflow: CiWorkflow
    let ciBuildRun: CiBuildRun

    struct CiWorkflow: Content {
        let id: String
    }

    struct CiBuildRun: Content {
        let id: String
        let executionProgress: String
        let completionStatus: String
    }
}
```

1. Define `WebhookPayload` struct


```swift
func routes(_ app: Application) throws {
    let deploymentService = ExampleDeploymentClient()
    let workflowID = "82D89C93-B69C-46B5-A794-A2BCFD3EE487"

    app.post("webhook") { req async throws -> HTTPStatus in
        let payload = try req.content.decode(WebhookPaylaod.self)
       
        if (payload.ciWorkflow.id == workflowID &&
            payload.ciBuildRen.executionProgress == "COMPLETE" &&
            payload.ciBuildRen.executionProgress == "SUCCESS") {
            await deploymentService.deploy(buildID: payload.ciBuildRun.id)
        }
        return HTTPStatus.ok
    }
}
```

2. Decode the webhook request using struct
3. Add logic comparing payload workflowID to Integration Tests workflowID
4. Tell Xcode Cloud to send build events to webhook

@Image(source: "WWDC24-10200-app-store-connect-add-webhook")

- Give webhook a name
- Add URL of Listener

## Review

@Image(source: "WWDC24-10200-xcode-cloud-review")

1. New code change is deployed to service’s test environment, 
2. A call to App Store Connect API starts a build of Integration Tests workflow
3. Tests validate the integration between app and test server
4. Results are processed by webhook listener 
5. If all the tests pass 
    - changes are deployed to production
6. Server change is pushed which causes issues
    - Integration Tests fails
    - Webhook listener prevents deployment change 







