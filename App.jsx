import React, {useEffect, useState} from 'react';
import {
  Button,
  NativeModules,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import parseQueryParameters from 'parse-url-query-params';
import Animated, {
  Easing,
  ReduceMotion,
  useSharedValue,
  withDelay, withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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

  // Animations

  const width = useSharedValue(100);

  const handlePress = () => {
    // width.value = width.value + 50;
    /*width.value = withTiming(width.value + 50, {
      duration: 500,
      easing: Easing.inOut(Easing.back(2.4)),
      //reduceMotion: ReduceMotion.System,
    });*/
    width.value = withRepeat(withSpring(width.value + 50), 3);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/*<Avatar />
        <Text>{currentDate}</Text>*/}
        {/*<WebView
          style={styles.webview}
          source={{uri: 'https://google.com?test=abc'}}
          onNavigationStateChange={onNavigationStateChange}
        />*/}
        <Animated.View
          style={{
            width,
            height: 100,
            backgroundColor: 'violet',
          }}
        />
        <Button onPress={handlePress} title="Click me" />
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
