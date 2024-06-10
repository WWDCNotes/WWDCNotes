# Design with iOS pickers, menus and actions

Create iPhone and iPad apps that look great and help people move quickly and directly to the information they need. Discover how you can integrate menus into your app for quick access to actions and settings, and learn where and when you should use them in your app. We’ll also walk you through the new Date Picker and Color Picker controls, and show you how to integrate them into your app.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10205", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(ATahhan)
   }
}



## Menus

* In iOS 14, you can show a Menu from any button
* Menus in iOS consist of:
  * Label-icon actions
  * A title
  * Separators

![][image-1]

* Do not add a Cancel button inside a menu, simply tapping outside the menu does the same effect

![][image-2]

* The menu adheres to the system accessibility settings by default

### Menus use cases:

1. Disambiguation: when you want to clear out what is the user's intent for this action
2. Navigation: giving extra options to navigate backward or forward
3. Selection: to select one option of many for actions like Sort and Filter
4. Secondary options: to show non-primary actions that are not important enough to be prominently displayed, but still should have easy access

* Do not hide all actions under one menu, instead, carefully promote your primary actions and group together secondary ones, if needed:

| ![][image-3] | ![][image-4] |

* You can make your buttons do one thing on tap, and another (showing a menu) on long press
* If there is a destructive action in your menu, make sure to always use an action sheet on iPhones, and pop-overs on iPad, to take the user confirmation before doing the action:
![][image-5]

## [`UIDatePicker`][UIDatePickerDoc]

![][image-6]

* New `UIDatePicker` can show date picker only, time picker only, or both.
* You can instruct the `UIDatePicker` to style itself for a `.compact` space, where it will display only a small key color on top of a light platter:
![][image-7]
Tapping on that key would present the date/time picker in a modal style
* `UIDatePicker` also adhere to the system’s accessibility settings

## [`UIColorPickerViewController`][colorPickerDoc]

![][image-8]

* You can use `UIColorPickerViewController ` to pick a color in of 4 different ways:
	* Grid
	* Spectrum
	* Sliders
  * Eyedropper from anywhere on the screen
  
* Picked colors are saved for the user to use them across apps

[image-1]:	WWDC20-10205-menu_constructs
[image-2]:	WWDC20-10205-no_menu_cancel
[image-3]:	WWDC20-10205-grouping_all_actions
[image-4]:	WWDC20-10205-not_grouping_all_actions
[image-5]:	WWDC20-10205-destructive_confirmation
[image-6]:	WWDC20-10205-uidatepicker
[image-7]:	WWDC20-10205-date_time_picker_compact
[image-8]:	WWDC20-10205-uicolorpicker

[UIDatePickerDoc]: https://developer.apple.com/documentation/uikit/uidatepicker
[colorPickerDoc]: https://developer.apple.com/documentation/uikit/uicolorpickerviewcontroller
