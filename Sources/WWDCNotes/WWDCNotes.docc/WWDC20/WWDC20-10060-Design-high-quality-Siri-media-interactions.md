# Design high quality Siri media interactions

Demystify the art of designing Siri experiences for your music and audio apps: We’ll show you how to think about crafting great interactions and how you can provide custom vocabulary so that Siri can respond with more accuracy and personality. We’ll also explain how you can debug common errors and test your intents using the same methods Apple’s own Siri team employs.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10060", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Siri intent Coverage:

- These are the most popular Siri interactions with voice (covering 90% of all utterances):

![][popularImage]

- The better your Siri support is, the more likely it is that people will make more complicated Siri requests.

## Vocabularies

- help Siri understand the user intent
- User vocabulary:
  - user/personalized items
  - shared with Siri via [`INVocabulary`][INVocabulary] API
  - the items order is by priority (put more important items first)

```swift
let vocabulary = INVocabulary.shared()
let playlistNames = NSOrderedSet(objects: "70s punk classics")
vocabulary.setVocabularyStrings(playlistNames, of: .mediaPlaylistTitle) 
```

-  
  - Here's how to set it:

```swift
// Set our playlist title in user vocabulary so we get the proper Siri intent
let vocabulary = INVocabulary.shared()
let playlistNames = NSOrderedSet(objects: "70s punk classics")
vocabulary.setVocabularyStrings(playlistNames, of: .mediaPlaylistTitle)
```

- [Global vocabulary][globalVocabulary]:
  - general static vocabulary
  - defined in `appIntentVocabulary.plist`
  - only include things that are particular to your app, don't include popular music or podcast entities, as those are generally already recognized by Siri as part of its NL model
  - example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>ParameterVocabularies</key>
	<array>
		<dict>
			<key>ParameterNames</key>
			<array>
				<string>INPlayMediaIntent.playlistTitle</string>
			</array>
			<key>ParameterVocabulary</key>
			<array>
				<dict>
					<key>VocabularyItemSynonyms</key>
					<array>
						<dict>
							<key>VocabularyItemPhrase</key>
							<string>70s punk anthems</string>
						</dict>
					</array>          
					<key>VocabularyItemIdentifier</key>
					<string>70s punk anthems</string>
				</dict>
			</array>
		</dict>
	</array>
</dict>
</plist>
```

## MPRemoteCommandCenter

- Use [`MPRemoteCommandCenter`][MPRemoteCommandCenter] to handle playback intents like "next track" and more (this is the same center used to respond playback actions in the lock screen)
- Siri reads the center's [`nowPlayingInfo`][nowPlayingInfo] to answer questions reguarding the current playing song (set properties such as `MPMediaItemPropertyTitle`, `MPMediaItemPropertyArtist`, `MPMediaItemPropertyAlbumTitle`)

[popularImage]: WWDC20-10060-popular

[nowPlayingInfo]: https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter/1615903-nowplayinginfo
[MPRemoteCommandCenter]: https://developer.apple.com/documentation/mediaplayer/mpremotecommandcenter
[INVocabulary]: https://developer.apple.com/documentation/sirikit/invocabulary
[globalVocabulary]: https://developer.apple.com/documentation/sirikit/registering_custom_vocabulary_with_sirikit/global_vocabulary_reference