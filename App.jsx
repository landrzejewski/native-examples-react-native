import React, {useEffect, useState} from 'react';
import { NativeModules, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import Avatar from './Avatar';
import WebView from 'react-native-webview';
import parseQueryParameters from 'parse-url-query-params';
import InAppBrowser from "react-native-inappbrowser-reborn";

const {TrainingModule} = NativeModules;

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

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(TrainingModule.getDate('dd-MM-yy'));
    //TrainingModule.getDateAsync('dd-MM-yy', setCurrentDate);

    /*InAppBrowser.openAuth('provider', 'redirectUri').then(result => {
      console.log(result);
    });*/
    //InAppBrowser.open('https://google.com');
  }, []);

  const onNavigationStateChange = navigationState => {
    console.log(navigationState);
    const params = parseQueryParameters(navigationState.url);
    console.log(params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Avatar />
        <Text>{currentDate}</Text>
        {/*<WebView
          style={styles.webview}
          source={{uri: 'https://google.com?test=abc'}}
          onNavigationStateChange={onNavigationStateChange}
        />*/}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});

export default App;
