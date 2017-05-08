import googleMaps from '@google/maps';
import { getSetting, newMutation } from 'meteor/vulcan:core';
import Places from '../modules/collection.js';

const googleMapsSetting = getSetting('googlemaps');

if (!googleMapsSetting) {
  throw new Error('Please fill in your Google Maps API Key or disable the Places package.');
}

const googleMapsClient = googleMaps.createClient({
  key: googleMapsSetting.apiKey
});

export const getPlaceDetails = (placeId, callback) => {
  googleMapsClient.place({
    placeid: placeId,
    language: getSetting('language', 'en')
  }, Meteor.bindEnvironment(callback));
}

const formatPlace = result => {
  const data = result.json.result;
  const place = _.pick(data, ['name', 'url', 'website', 'adr_address']);
  place._id = result.json.result.place_id;
  place.location = { type: 'Point', coordinates: [ data.geometry.location.lat, data.geometry.location.lng ] }
  return place;
}

export const checkAndAddPlace = placeId => {
  const existingPlace = Places.findOne({_id: placeId});

  if (!existingPlace) {

    getPlaceDetails(placeId, (error, result) => {

      const place = formatPlace(result);

      return newMutation({
        collection: Places,
        document: place, 
        validate: false,
      });
    
    });

  }
}