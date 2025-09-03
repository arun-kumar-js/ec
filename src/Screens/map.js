import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const MapLocation = () => {
  const navigation = useNavigation();
  const [markerCoord, setMarkerCoord] = useState({
    latitude: 19.076, // Mumbai coordinates
    longitude: 72.8777,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This app needs to access your location',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Location permission denied');
            return;
          }
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMarkerCoord({ latitude, longitude });
        },
        error => {
          console.error('Error getting location:', error);
          // Keep default coordinates if location access fails
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();
  }, []);

  const handleSelectLocation = () => {
    Alert.alert(
      'Location Selected',
      `Latitude: ${markerCoord.latitude.toFixed(
        6,
      )}\nLongitude: ${markerCoord.longitude.toFixed(6)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Navigate back with the selected location
            navigation.goBack();
            // You can also pass the location data back if needed
            // navigation.navigate('AddAddress', { selectedLocation: markerCoord });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: markerCoord.latitude,
          longitude: markerCoord.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={e => setMarkerCoord(e.nativeEvent.coordinate)}
      >
        <Marker
          coordinate={markerCoord}
          title="Selected Location"
          description="Tap anywhere to change location"
          draggable
          onDragEnd={e => setMarkerCoord(e.nativeEvent.coordinate)}
        />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.coordText}>
          Latitude: {markerCoord.latitude.toFixed(6)}
          {'\n'}
          Longitude: {markerCoord.longitude.toFixed(6)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectLocation}
      >
        <Text style={styles.buttonText}>Select This Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: verticalScale(50),
    left: scale(20),
    right: scale(20),
    padding: moderateScale(10),
    backgroundColor: '#ffffff',
    borderRadius: scale(8),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coordText: {
    color: '#333',
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontFamily: 'Roboto',
  },
  selectButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: scale(20),
    right: scale(20),
    backgroundColor: '#e60023',
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
