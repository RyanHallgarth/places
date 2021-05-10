import * as SQLite from "expo-sqlite";

//database logic

//openDatabase() receives a database name
//If it doesn't exist, it is created
const db = SQLite.openDatabase("places1.db");

//Create table if it doesn't exist

//transaction() ensures if some part of the query
// fails, the entire query is rolled back to avoid corruption
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL, lng REAL NOT NULL);",
        // Array of arguments
        [],
        // success function
        () => {
          resolve();
        },
        // failure function
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertPlace = (
  title,
  description,
  imageUri,
  address,
  lat,
  lng
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO places (title, description, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?, ?);",
        // Array of arguments
        [title, description, imageUri, address, lat, lng],
        // success function
        (_, result) => {
          resolve(result);
        },
        // failure function
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        // Array of arguments
        [],
        // success function
        (_, result) => {
          resolve(result);
        },
        // failure function
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
