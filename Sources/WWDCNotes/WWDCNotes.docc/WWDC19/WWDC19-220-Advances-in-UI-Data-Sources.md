# Advances in UI Data Sources

Use UI Data Sources to simplify updating your table view and collection view items using automatic diffing. High fidelity, quality animations of set changes are automatic and require no extra code! This improved data source mechanism completely avoids synchronization bugs, exceptions, and crashes! Learn about this simplified data model that uses on identifiers and snapshots so that you can focus on your app’s dynamic data and content instead of the minutia of UI data synchronization.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/220", purpose: link, label: "Watch Video (36 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



All our collection views (both `UITableView` and `UICollectionView`) are getting an overdue refresh this year. 

We no longer need to use `IGListKit` and the likes, we no longer need to call `.reloadData()` or `performBatchUpdates()`.

Introducing:

- [`UICollectionViewDiffableDataSource`][collDataSourceDoc]
- [`UITableViewDiffableDataSource`][tableDataSourceDoc]

In short, what we must do now in our collection views is inject one of the two data sources above.

These new data source types will manage a snapshot of our data state:

- You can think of a snapshot as the collection view current state (you can query them the number of sections and rows per section and more). 
- The snapshot has elements, which can be our models instances, or just as an identifier of a model, that helps us identify unequivocally a data element. These elements must conform to Hashable.

Three steps:

1. create a snapshot (you can start from the current snapshot, or create a new one)
2. configure it 
3. apply to our data source

All is awesome for data sources now, what about our collection views delegates?
No api changes, for them. However, the data source exposes a way to go from an `indexPath` to a `identifier`:

```swift
func collectionView(
  _ collectionView: UICollectionView,
  didSelectItemAt indexPath: IndexPath
) { 
  if let identifier = dataSource.itemIdentifier(for: indexPath) { 
    // Do something
  }
}
```

Therefore we get all the advantages of our new datasource in the delegate as well 👍🏻
Note: this indexPath -> identifier/object is done in constant time.

We can call `apply()` in a background thread.
> ⚠️ We must always call `apply()` from the background queue or the  main queue. No mix!

Here’s an example of how to inject a data source:

```swift
func configureDataSource() { 
  dataSource = UICollectionViewDiffableDataSource 
    <Section, MountainsController.Mountain>(collectionView: mountainsCollectionView) { 
      (collectionView: UICollectionView, indexPath: IndexPath, mountain: MountainsController. Mountain) -> UICollectionViewCell? in 
    guard let mountainCell = collectionView.dequeueReusableCell(
      withReuseIdentifier: LabelCell.reuseIdentifier, for: indexPath) as? LabelCell else {
        fatalError("Cannot create new cell")
    } 
    mountainCell.label.text = mountain.name
    return mountainCell
  }
}
```

Note how we also pass the method to set and return a new cell when injecting it, most importantly, note how that method also passes our associated element at that index. We no longer need to do lookups etc.

Lastly, both the new data source types are generic (no objc), therefore we will need two (hashable) types, one for sections (an enum will suffice) and one for the elements (duh).

[collDataSourceDoc]: https://developer.apple.com/documentation/uikit/uicollectionviewdiffabledatasource
[tableDataSourceDoc]: https://developer.apple.com/documentation/uikit/uitableviewdiffabledatasource