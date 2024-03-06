import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import Avatar from './Avatar';

const App = () => {
  (async () => {
    const user = {
      id: 1,
      firstName: 'Jan',
      lastName: 'Kowalski',
      age: 32,
    };
    // AsyncStore
    const userKey = 'user';
    await AsyncStorage.setItem(userKey, JSON.stringify(user));
    const loadedUser = JSON.parse(await AsyncStorage.getItem(userKey));
    console.log(loadedUser);

    // SQLite
    const db = openDatabase({name: 'users.db'});
    db.transaction(tx =>
      tx.executeSql(
        'create table if not exists users (id integer primary key, firstName text, lastName text, age integer)',
      ),
    );

    db.transaction(tx => tx.executeSql('delete from users'));

    db.transaction(tx => {
      const parameters = Object.values(user);
      tx.executeSql(
        'insert into users (id, firstName, lastName, age) values (?, ? ,?, ?)',
        parameters,
      );
    });

    db.transaction(tx =>
      tx.executeSql('select * from users', [], (tx, results) => {
        const rowsCount = results.rows.length;
        for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
          console.log(results.rows.item(rowIndex));
        }
      }),
    );
  })();

  return (
    <View style={styles.container}>
      <Avatar />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
