# Host and automate your DocC documentation

Find out how you can easily host your Swift package and framework DocC documentation online. We’ll take you through configuring your web server to host your generated DocC archives, and help you learn to use the xcodebuild tool to automate documentation generation and keep your web content synchronized and up to date.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10236", purpose: link, label: "Watch Video (13 min)")

   @Contributors {
      @GitHubUser(Jeehut)
      @GitHubUser(zntfdr)
   }
}



What is a Documentation Archive (`.doccarchive`)?

- container that holds all the data to both read the documentation in Xcode and to host it online
- It is structured as a single page Vue.js web app that's used to render both your reference documentation and articles and your rich and interactive tutorials

## Hosting documentation

- Two types of requests that a server needs to handle:
  - requests for documentation and tutorial pages where the request URL starts with `/documentation/` or `/tutorials/`
  - requests for additional files and data that is loaded by the web app, where the request URL matches the relative file path for one of the files in the documentation archive

- Responses:
  - documentation and tutorial requests should be responded with a  `index.html` file that's located in the documentation archive
  - those files reference CSS and JavaScript within the documentation archive (`/css/..` and `/js/..`)
  - once the web app has loaded on the client browser, it will start asking for documentation and tutorials data (`/data/..`) and other assets (e.g. images `/images/..`)

Both the files that is referenced by the `index.html` file and the content and media that is loaded by the web app use request URLs that match the folder structure of the documentation archive.

### `.htaccess` rules

Two routing rules to setup:

1. one for documentation and tutorial pages
2. one for the additional files and data

```
# Enable custom routing.
RewriteEngine On

# Route documentation and tutorial pages.
RewriteRule ^(documentation|tutorials)\/.*$ SlothCreator.doccarchive/index.html [L]

# Route files within the documentation archive.
RewriteRule ^(css|js|data|images|downloads|favicon\.ico|favicon\.svg|img|theme-settings\.json|videos)\/.*$ SlothCreator.doccarchive/$0 [L]
```

## Automating docs

```shell
# Build documentation for the project.
# Specify a custom derivedDataPath, where the build products and the built documentation will be written.
xcodebuild docbuild                    \
  -scheme "SlothCreator"               \
  -derivedDataPath MyDerivedDataFolder
  
# Find all the built documentation archives
# and copy them into ~/www where we
# host the SlothCreator website and documentation.
find MyDerivedDataFolder               \
  -name "*.doccarchive"                \
  -exec cp -R {} ~/www \;
``` 

- Available `xcodebuild docbuild` options: `-scheme`, `-sdk`, `-destination`, `-configuration`, `-derivedDataPath`
