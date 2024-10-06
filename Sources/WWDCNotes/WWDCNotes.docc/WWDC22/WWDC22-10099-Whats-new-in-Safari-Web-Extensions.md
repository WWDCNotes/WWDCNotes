# What’s new in Safari Web Extensions

Learn how you can use the latest improvements to Safari Web Extensions to create even better experiences for people browsing the web. We'll show you how to upgrade to manifest version 3, adopt the latest APIs for Web Extensions, and sync extensions across devices.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10099", purpose: link, label: "Watch Video (23 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



> [Sample app](https://developer.apple.com/documentation/safariservices/safari_web_extensions/modernizing_safari_web_extensions)

## Manifest version 3

- next iteration of the web extension platform
- introduces performance and security improvements and consolidates popular extension APIs
- supported from Safari 15.4 (you can keep using version 2 if your platform target is lower)

### What's new

#### Use of service workers instead of background pages

- service workers are event driven pages where you can register listeners using the `addEventListener`
- compatible with other browsers
- substitute with non-persistent background pages

#### APIs for executing JavaScript and styling on a web page have moved from the tabs API to the new scripting API

- most functionality stays the same
- new ways to inject code on a webpage
- more options for which frames on the page the code should be executed in
- ability to decide which execution environment the code should run in

#### Execute scripts on webpages

Version 2:

```js
browser.tabs.executeScript(1, {
  frameId: 1,                                      // 👈🏻 supports only one id
  code: "document.body.style.background = 'blue';" // 👈🏻 can only inject code that's contained in a string
});
```

Version 3:

```js
function changeBackgroundColor(color) {
  document.body.style.background = color;
};

browser.scripting.executeScript({
  target: { tabId: 1, frameIds: [ 1 ] }, // 👈🏻 supports multiple ids
  func: changeBackgroundColor,           // 👈🏻 we can pass along a function object containing this code, instead of just a string
  args: [ "blue" ]                       // 👈🏻 we can pass arguments to the function
});
```

#### Load scripts on webpages

Version 2:

```js
browser.tabs.executeScript(1, {
  file: "file.js" // 👈🏻 can specify only one file
});
```

Version 3:

```js
browser.scripting.executeScript({
  target: { tabId: 1 },
  files: [ "file.js", "file2.js" ] // 👈🏻 can specify multiple file
});
```

#### Changing styling

Like above, we can now add/remove multiple files:

Add styling:

```js
browser.scripting.insertCSS({
  target: { tabId: 1, frameIds: [ 1, 2, 3 ] },
  files: [ "file.css", "file2.css" ]
});
```

Remove styling:

```js
// Remove styling
browser.scripting.removeCSS({
  target: { tabId: 1, frameIds: [ 1, 2, 3 ] },
  files: [ "file.css", "file2.css" ]
});
```

#### Adding web accessible resources

In version 2, every resource you include can be accessed by any website you specify in the Manifest.
In version 3, you can specify which resource is available in which website:

```json
"web_accessible_resources": [
  {
    "resources": [ "pie.png" ],
    "matches": [ "*://*.apple.com/*" ] // 👈🏻
  },
  {
    "resources": [ "cookie.png" ],
    "matches": [ "*://*.webkit.org/*" ] // 👈🏻
  }
]
```

### How to migration to version 3

1. set version 3 in `manifest_version` in your <kbd>manifest.json</kbd> file
2. manually migrate any of the APIs seen above
3. run your extension and inspect it to get access to the console and see if there are any error messages

## Updated APIs

### Declarative Net Request

- Declarative net request is a content blocking API that provides web extensions with a fast and privacy preserving way to block or modify network requests using rulesets
- these rules are defined in the manifest file
- V2: up to 10 rulesets, V3: up to 50 rulesets
- only 10 rulesets can be enabled at any given time (you can set `enabled: true` in the rules declaration in the manifest)

#### Dynamically add/remove rules (Safari 15.4+)

```js
// Rules that won't persist across browser sessions or extension updates
browser.declarativeNetRequest.updateSessionRules({ addRules: [ rule ] });

// Rules that will persist across browser sessions or extension updates
browser.declarativeNetRequest.updateDynamicRules({ addRules: [ rule ] });
```

### Message from webpage to extension - `externally_connectable` (Safari 15.4+)

- allows websites to create custom behavior if the user has your extension enabled
- you declare match patterns in the Manifest:

```json
{
  ...,
  "externally_connectable": {
    "matches": ["*://*.apple.com/*"] // 👈🏻 determines which pages can communicate with your extension
  }
}
```

- must use the browser namespace
- user must grant permission

In the website:

```js
// 👇🏻 you must use this id format "app.extension.id (appstore.team.id)"
let extensionID = "com.apple.Sea-Creator.Extension (GJT7Q2TVD9)";
// 👆🏻 you will have different IDs for other browsers

browser.runtime.sendMessage(
  extensionID, 
  { greeting: "Hello!" }, // 👈🏻 sent message 
  function(response) {    // 👈🏻 callback to handle response
    console.log("Received response from the background page:");
    console.log(response.farewell);
  }
);
```

In the extension (background page/session):

```js
//                  👇🏻 listen for messages
browser.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
  console.log("Received message from the sender:");
  console.log(message.greeting);
  sendResponse({ farewell: "Goodbye!" }); // 👈🏻 send a message back
});
```

Because your extension will have a different id in different browsers, in the browser your website can use an helper function to determine which id to use:

```js
// Determining the correct identifier

function determineExtensionID(extensionID) {
  return new Promise((resolve) => {
  try {
    browser.runtime.sendMessage(extensionID, { action: 'determineID' }, function(response) {
    if (response)
      resolve({ extensionID: extensionID, isInstalled: true, response: response });
    else 
      resolve({ extensionID: extensionID, isInstalled: false });
    });
  }
  });
};
```

In the extension:

```js
browser.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
  if (message.action == "determineID") {
  sendResponse({ "Installed" });
  }
});
```

## Unlimited storage (15.4+)

- no longer 10 MB quota per extension
- you can use as much data as you see fit
- users can clear extension data at any given time

- add the following permission in your manifest:

```js
"permissions": [ "storage", "unlimitedStorage" ]
```

## Syncing extensions

- if a user turns on your extension on one of their devices, it'll be turned on on all of their devices
- easier extension download (in the settings.app, you can enable to automatically download/enable extensions)
- automatic if your extension is an universal purchase (available on all platforms)
- if you don't use universal purchase, you can manually link your apps:

Associate iOS extension to mac app:

```js
// Info.plist for macOS App
SFSafariCorrespondingIOSAppBundleIdentifier

// Info.plist for macOS Extension
SFSafariCorrespondingIOSExtensionBundleIdentifier
```

Associate mac extension to iOS app:

```js
// Info.plist for i0S App
SFSafariCorrespondingMacOSAppBundleIdentifier

// Info.plist for iOS Extension
SFSafariCorrespondingMacOSExtensionBundleIdentifier
```
