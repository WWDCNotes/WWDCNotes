# Code-along: Build powerful drag and drop in SwiftUI

Follow along as we build a game of Solitaire to explore the latest drag-and-drop capabilities in SwiftUI. We’ll show you how to use the new reordering API to let people arrange content, implement drag containers to move multiple items at once, and customize the drag-and-drop lifecycle to fit your app’s rules. To get the most out of this session, watch “Meet Transferable” from WWDC22.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/271", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary

- New APIs for drag and drop enhance UI interactions in iOS 2027 and beyond.
- Reorderable API allows users to rearrange content with drag gestures.
- Drag container API supports dragging multiple items at once.
- Solitary game example demonstrates practical implementation of new features.

@Image(source: "WWDC26-271-drag-and-drop.jpeg", alt: "Drag and Drop in SwiftUI")

## Presenters

- Jack Wiig, UI Frameworks Engineer

## Drag and Drop APIs in iOS 2027

- **Dragable and Drop Destination Modifiers**: 
  - `dragable`: Enables moving content like photos and text.
  - `dropDestination`: Allows apps to accept various content types.

- **New Features**:
  - **Reordering API**: 
    - Allows rearranging of content using drag and drop.
    - Utilizes `reorderable` and `reorderContainer` modifiers.
    - Supports scoped reordering within specific containers.

  - **Drag Container API**: 
    - Enables dragging multiple items simultaneously.
    - Customizes drag behavior with `dragPreviewsFormation` for visual consistency.

  - **Drag Configuration API**:
    - Configures how data is transferred (e.g., by move vs. copy).
    - Used to ensure proper data handling during drag operations.

## Example: Solitaire Game

- **Implementation Steps**:
  1. **Reordering**: 
     - Use `reorderable` modifier for individual items.
     - `reorderContainer` to manage multiple related items.

      ```swift
      HStack {
         ForEach(cards) { card in
            CardFaceView(card: card)
         }
         .reorderable()
      }
      .reorderContainer(for: CardValue.self) { difference in
         cards.apply(difference: difference)
      }
      ```

      ```swift
      HStack {
         // ...
      }
      .reorderContainer(for: CardValue.self, in: Card.Group.self) { difference in
         game.moveCards(difference: difference)
      }
      ```

      ```swift
      ForEach(cards[index...], id: \.value) { card in
         CardView(card: card)
      }
      .reorderable(collectionID: Card.Group.pile(index))
      ```

  2. **Multiple Item Dragging**:
     - Implement selection model to drag multiple cards.
     - Use `dragContainer` to support grouped item dragging.

      ```swift
      VStack {
         // ...

         HStack {
            // ...
         }
         .reorderContainer(for: CardValue.self, in: Card.Group.self) { difference in
            game.moveCards(difference: difference)
         }
         .dragContainer(for: CardValue.self) { cardID in
            game.cardStack(startingAt: cardID)
         }
         .dragPreviewsFormation(.stack)
      }
      .dropPreviewsFormation(.stack)
      ```

  3. **Data Transfer Customization**:
     - Use `dragConfiguration` and `dropConfiguration` to manage data movement.
     - Ensure game logic prevents invalid moves.

      ```swift
      HStack {
         // ...
      }
      .dragContainer(for: CardValue.self) { cardID in
         [cardID]
      }
      .dragConfiguration(DragConfiguration(allowMove: true))
      .dropDestination(for: CardValue.self) { newCards, session in
        if let destination = session.reorderDestination(
            for: CardValue.self, in: Card.Group.self) {
            game.insertCards(newCards, to: destination)
         }
      }
      .dropConfiguration { session in
         let alignedX = session.location.x - 0.5 * spacing
         let pile = Int(alignedX / (cardWidth + spacing))
         let destination = ReorderDifference<CardValue, Card.Group>
            .Destination(position: .end, collectionID: .pile(pile))

         let allowed = session.suggestedOperations.contains(.move)
           && game.validateMove(session: session, destination: destination)

         let operation: DropOperation = allowed ? .move : .forbidden

         return DropConfiguration(operation: operation, destination: destination)
      }
      ```

## Recommendations

- Consider adding drag and drop features to enhance app interactivity.
- Use APIs to allow reordering and multiple item interactions.
- Customize drag and drop configurations for specific app needs.
