import React, { useState, useEffect, useRef, } from 'react';
import { Text, View, StyleSheet, AppState, } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function Geo() {
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      _getLocation();
    }
    //FIX BUG WHERE USER CANT DENY LOCATION REQUEST
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Allow access to location services to use this app');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
      console.log('This is the location');
      console.log(location);
    }
    catch (error){
      let status = Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        setErrorMsg('Turn on location services to use this app');
      }
    }
 };

  if (errorMsg) {
    // alert(errorMsg);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Latitude = {latitude}</Text>
      <Text style={styles.paragraph}>Longitute = {longitude}</Text>
      <Text>Current state is: {appStateVisible}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 5,
    fontSize: 18,
    textAlign: 'center',
  },
});