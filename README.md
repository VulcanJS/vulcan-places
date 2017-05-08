# Vulcan Places

### Install

```
meteor add vulcan:places
```

### Usage

This package enables two distinct features, which can be used separately or together: 

1. A `PlaceControl` autocomplete form component that lets users fill in a place via the Google Maps Places API.
2. A `Places` collection that can optionally be used to store places as individual documents.

Both require setting your Google Maps API key in your `settings.json` file's `public` section: 

```
"googlemaps": {
  "apiKey": "123foo"
}
```

### Place Form Control

Uses [https://github.com/kenny-hibino/react-places-autocomplete](https://github.com/kenny-hibino/react-places-autocomplete).

To use:

1. Import `PlaceControl` from 'meteor/vulcan:places'
2. Create a `placeName` custom field on one of your collections
3. Set this field's `control` property to `PlaceControl`. 
4. Also create a `placeId` field on the same collection.
5. Add `placeName` and `placeId` to the appropriate fragments. 

### Places Collection

Uses [https://github.com/googlemaps/google-maps-services-js](https://github.com/googlemaps/google-maps-services-js).

The `Places` collection makes it easy to check for a `placeId` field on a newly inserted or edited document, and if present insert a new place document.

There are two distinct ways to use this collection:

1. Associate a place with one or more documents from another collection, such as adding a location to individual photos.
2. Build a Yelp-like directory of places by using the `Places` collection as a base and adding your own custom fields to it. 

#### checkAndAddPlace

The package exports a `checkAndAddPlace` function that takes a `placeId`, checks the `Places` collection for any existing document with that id, and if none is found queries the Google Places API for the place details before inserting it in the database:

```js
import { addCallback } from 'meteor/vulcan:core';
import { checkAndAddPlace } from 'meteor/vulcan:places';

function postsNewCheckForNewPlace (document, user) {
  if (document.placeId) checkAndAddPlace(document.placeId);
}
addCallback('posts.new.async', postsNewCheckForNewPlace);

function postsEditCheckForNewPlace (document) {
  if (document.placeId) checkAndAddPlace(document.placeId);
}
addCallback('posts.edit.async', postsEditCheckForNewPlace);
```

#### Resolvers

The package also creates resolvers for the `Places` collection. 
