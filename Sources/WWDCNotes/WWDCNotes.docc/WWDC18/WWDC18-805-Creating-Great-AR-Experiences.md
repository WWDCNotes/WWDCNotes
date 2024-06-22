# Creating Great AR Experiences

Engaging AR experiences are easy to start and navigate, persuasively realistic, and highly immersive. Learn best practices for successfully bringing people into an AR experience, teaching them about how to interact and engage with virtual content, and making your AR content look beautiful and grounded in the real world.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/805", purpose: link, label: "Watch Video (62 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Always introduce the user to the AR experience. Tell them what they should do, possibly with a neat animation (and no words):

| ![][ar1Image] | ![][ar2Image] |

- Use (UI) feedback to guide the user when otherwise he would be lost
- Match you app (UI) style, it should feel like the rest of the app
- Keep (AR) text to a minimum, use the display to show (text) details 
- Remember that for AR experiences at least one hand will be always busy holding the phone, therefore if you want to make a one-handed AR experience, make sure to have all the controls very easy to reach
- Think about AR experience both at day and night, don’t use colors that stick out too much from what the camera captures (or try to use ambient light estimate that ARKit gives you), try to make your AR objects blend as much as possible
- Try to keep the poly counts of your 3d models as little as possible (you might want to show many at the same time, and you also want to hit those 60fps)
- A lot of tips and tricks regarding 3d graphics:
![][3dImage]

[ar1Image]: WWDC18-805-ar1
[ar2Image]: WWDC18-805-ar2
[3dImage]: WWDC18-805-3d