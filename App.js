import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import DropdownComponent from './Dropdown';
const buildingsData = require('./public/mock.json');

const App = () => {
  // const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({
    latitude: -0.1668390228120417,
    longitude: 35.96636268894964,
    latitudeDelta: 0.0015,
    longitudeDelta: 0.0015,
  });
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [flag, setFlag] = useState(null);
  const [buildings, setBuildings] = useState(null);
  const [floors, setFloors] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [floorArr, setFloorArr] = useState(null);
  const [roomArr, setRoomArr] = useState(null);
  const [mapLayer, setMapLayer] = useState('standard');
  const [destination, setDestination] = useState({
    latitude: -0.1668390228120417,
    longitude: 35.96636268894964,
  });
  const [descriptionText, setDescriptionText] = useState(null);
  const [origin, setOrigin] = useState({
    latitude: position.latitude || -0.1668390228120417,
    longitude: position.longitude || 35.96636268894964,
  });
  const [wrongDirection, setWrongDirection] = useState(false);
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAJdpbcE0I1ea-BsXL5QOEtDqZC6PBKAJ0';

  // Parser for buildings object to be passed to dropdown component
  const getBuildingObject = jsonObj => {
    const data = [];
    let obj = {};
    const blds = Object.keys(jsonObj.buildings);
    blds.map(item => {
      obj.label = item;
      obj.value = item;
      data.push(obj);
      obj = {};
    });
    return data;
  };
  // Parser for floors object to be passed to dropdown component
  const getFloorObject = jsonObj => {
    const data = [];
    let obj = {};
    const blds = Object.keys(jsonObj);
    console.log;
    blds.map(item => {
      switch (item) {
        case '0':
          obj.label = 'G';
          obj.value = item;
          break;
        case '1':
          obj.label = '1st';
          obj.value = item;
          break;
        case '2':
          obj.label = '2nd';
          obj.value = item;
          break;
        default:
          obj.label = item;
          obj.value = item;
      }

      data.push(obj);
      obj = {};
    });
    return data;
  };
  // Parser for Rooms object to be passed to dropdown component
  const getRoomObject = (jsonObj, floor) => {
    const data = [];
    let obj = {};
    let f = '';
    switch (floor) {
      case '0':
        f = 'G';
        break;
      case '1':
        f = '1st';
        break;
      case '2':
        f = '2nd';
        break;
      default:
        f = '3rd';
    }
    let roomz = jsonObj[f].rooms;
    setRoomArr(roomz);

    roomz.map(item => {
      let r = Object.keys(item);
      r.map(lr => {
        obj.label = lr;
        obj.value = lr;
        data.push(obj);
        obj = {};
      });
    });
    return data;
  };

  useEffect(() => {
    requestLocationPermission();
    setTimeout(getLocation, 3000);
    // getLocation();
    const build = getBuildingObject(buildingsData);
    setBuildings(build);
  }, []);

  const onPress = () => {
    mapLayer === 'standard' ? setMapLayer('hybrid') : setMapLayer('standard');
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setPosition({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        });
        setOrigin({latitude: latitude, longitude: longitude});

        // setTimeout(() => setLoading(false), 3000);
        // setFlag(false);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  async function requestLocationPermission() {
    try {
      const granted_fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Kabarak Navigator',
          message: 'Kabarak Navigator would like to access your location ',
        },
      );

      if (granted_fine === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        // console.log(granted_fine);
        // DevSettings.reload();
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  //Handler to be run after building(destination) selection
  const buildingHandler = (building, obj) => {
    setDescriptionText(null);
    let b = obj[building];
    let f = b.floors;
    setFloors(getFloorObject(f));
    setFloorArr(f);
    let coords = {
      latitude: b.coordinates.latitude,
      longitude: b.coordinates.longitude,
    };
    setDestination(coords);
  };

  //Handler to be run when floor is selected
  const floorHandler = (floor, arr) => {
    let f = arr[floor];
    let r = getRoomObject(f, floor);
    setRooms(r);
    setDescriptionText(null);
  };

  //Handler to be run when room is selected
  const roomHandler = (room, arr) => {
    let room_obj = arr[0];
    let room_item = room_obj[room];
    setDescriptionText(room_item.description);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kabarak Navigator</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.dropdowns}>
        {buildings && (
          <DropdownComponent
            list={'Buildings'}
            obj={buildingsData.buildings}
            handler={buildingHandler}
            data={buildings}
            setter={setDestination}
          />
        )}
        {floors && (
          <DropdownComponent
            list={'Floors'}
            obj={floorArr}
            handler={floorHandler}
            data={floors}
          />
        )}
        {rooms && (
          <DropdownComponent
            list={'Rooms'}
            handler={roomHandler}
            obj={roomArr}
            data={rooms}
          />
        )}
      </View>
      <MapView
        region={position}
        style={styles.map}
        showsUserLocation={true}
        showsCompass={true}
        userLocationPriority="high"
        zoomEnabled
        mapType={mapLayer}
        userLocationUpdateInterval={1000}
        loadingEnabled={true}
        zoomControlEnabled>
        {destination && (
          <Marker coordinate={destination} title={'Destination'}>
            <Callout>
              <View>
                <Text style={styles.footerText}>Your Destination</Text>
              </View>
            </Callout>
          </Marker>
        )}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor={'maroon'}
          // optimizeWaypoints={true}
          precision={'low'}
          mode={'WALKING'}
          splitWaypoints={true}
          onReady={result => {
            setDistance(result.distance);
            setDuration(result.duration);
            setTimeout(() => setFlag(true), 3000);

            // Compare user's current position with route's initial position
            const {coordinates} = result.directions[0];
            const initialPosition = coordinates[0];

            if (
              Math.abs(origin.latitude - initialPosition.latitude) > 0.001 ||
              Math.abs(origin.longitude - initialPosition.longitude) > 0.001
            ) {
              // User is going in the wrong direction
              setWrongDirection(true);
            } else {
              setWrongDirection(false);
            }
          }}
        />
      </MapView>
      {descriptionText && (
        <View style={styles.description}>
          <ScrollView>
            <Text style={styles.footerText}>{descriptionText}</Text>
          </ScrollView>
        </View>
      )}
      <View style={styles.footer}>
        {/* {{distance} && <Text style={styles.loadingText}>Loading Map...</Text>} */}
        {flag ? (
          <Text style={styles.footerText}>
            Distance: {distance} km | Duration: {Math.floor(duration)} min
          </Text>
        ) : (
          <Text style={styles.footerText}>Loading ...</Text>
        )}
        {wrongDirection && (
          <Text style={styles.footerText}>
            You are going in the wrong direction!
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Map Type</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  map: {
    flex: 2,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    flex: 0.15,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
    fontSize: 24,
    fontWeight: '100',
    paddingTop: 10,
    color: 'maroon',
  },
  loadingText: {
    color: 'maroon',
    fontWeight: '100',
    textAlign: 'center',
    margin: 2,
  },
  dropdowns: {
    padding: 10,
    width: 'auto',
    flex: 0.15,
    flexDirection: 'row',
  },
  description: {
    flex: 0.15,
    padding: 15,
    border: 1,
  },
  footer: {
    flex: 0.1,
    paddingTop: 10,
  },
  footerText: {
    fontWeight: '300',
    color: 'black',
  },
  button: {
    position: 'absolute',
    borderColor: 'maroon',
    borderWidth: 0.25,
    paddingHorizontal: 5,
    paddingVertical: 5,
    top: 5,
    left: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: '100',
    color: 'black',
  },
});

export default App;
