import * as FileSystem from "expo-file-system";
export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../env";

export const addPlace = (title, description, image, location) => {
  return async (dispatch) => {
    //fetch geocoding object from Google Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }
    // Store response object in resData
    const resData = await response.json();

    if (!resData) {
      throw new Error("resData did not populate");
    }
    const address = resData.results[0].formatted_address;

    //In order for data to persist, we must move data from the
    // cacheDirectory to the documentDirectory

    //Splits image path by slashes, stores segments in array
    //Isolates last segment and stores in fileName
    const fileName = image.split("/").pop();
    // Target new file location in the documentDirectory
    const newPath = FileSystem.documentDirectory + fileName;

    //moveAsync accepts an object with 'to' and 'from' properties
    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });
      const dbResult = await insertPlace(
        title,
        description,
        newPath,
        address,
        location.lat,
        location.lng
      );
      console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          description: description,
          image: newPath,
          address: address,
          coords: { lat: location.lat, lng: location.lng },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      console.log(dbResult);
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};
