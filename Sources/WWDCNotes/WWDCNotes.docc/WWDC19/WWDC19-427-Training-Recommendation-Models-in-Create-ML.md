# Training Recommendation Models in Create ML

Recommendation models for Core ML can enable a very personal experience for the customers using your app. They power suggestions for what music to play or what movie to see in the apps you use every day. Learn how you can easily create a custom Recommendation model from all sorts of data sources using the Create ML app. Gain a deeper understanding of how this kind of personalization is possible while maintaining user privacy. See an example of one of these recommenders in action.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/427", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Create ML Recommenders are a fantastic way to add personalization and intelligence into the user experience of our app. 

Recommenders work by looking for patterns in groups of items. 

Recommenders use a tabular approach:

![][tableImage]

Each row here says that a particular item belongs to a particular group. In this example the groups are recipes and the items are ingredients.

A rating is a measure of how good or how desirable a particular interaction is.

Now, when we throw all the items into the mix, the Recommender builds a graph of which items tend to go with which other items. How they're all related.

And it's this _graph_ that gets packaged into our model. 

All of the user data and the group data present in our training data is not explicitly present in the final model.

[tableImage]: table.png