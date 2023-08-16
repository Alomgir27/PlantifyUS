import React from "react";
import {
  ImageBackground,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import MapView, { Marker } from 'react-native-maps';
import * as Icon from "@expo/vector-icons";

import { COLORS } from "../constants/index";
import { Text } from "../components";
import { Text as Text2 } from "react-native-elements";

import { setLocation, setFilters, setCampings } from "../modules/campings";

const { width, height } = Dimensions.get("screen");


class Campings extends React.Component {
  static navigationOptions = {
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      events: [],
      loading: false
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  async componentDidMount() {
    const { events } = this.props?.data;
    this.props.setCampings(events);
    this.setState({ events: this.props?.data?.events });
  }



  handleTab = tabKey => {
    this.props.setFilters({ type: tabKey });
  };


  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <View style={styles.settings}>
              <View style={styles.location}>
                <Icon.FontAwesome
                  name="location-arrow"
                  size={14}
                  color={COLORS.white}
                />
              </View>
            </View>
            <View style={styles.options}>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>
                {this.props.mylocation.latitude.toFixed(4)}, {this.props.mylocation.longitude.toFixed(4)}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.gray }}>
                Where are you going?
              </Text>
            </View>
             
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Icon.MaterialCommunityIcons name="tree" size={24} color={COLORS.primary} />
          </View>
        </View>
         
        {this.renderTabs()}
      </View>
    );
  }

  renderMap() {
    const { filters, campings } = this.props;
    const mapSpots =
      filters.type === "pending"
        ? campings
        : campings.filter(camping => camping?.status === filters.type);

    return (
      <View style={styles.map}>
        <MapView
          style={{ flex: 1, height: height * 0.5, width }}
         // showsMyLocationButton
          initialRegion={{ // TODO: change this to the user's location
            latitude: this.props.mylocation.latitude,
            longitude: this.props.mylocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          //keep zoomed in on user's location but zoom out to see all markers
          initialCamera={{
            center: {
              latitude: this.props.mylocation.latitude,
              longitude: this.props.mylocation.longitude,
            },
            pitch: 0,
            heading: 0,
            altitude: 1000,
            zoom: 10,
          }}
          onPress={(e) => this.props.setLocation(e.nativeEvent.coordinate)}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          showsIndoorLevelPicker={true}
          showsPointsOfInterest={true}
          showsScale={true}
          
        >
          <Marker coordinate={this.props.mylocation}>
            <View style={styles.myMarker}>
              <View style={styles.myMarkerDot} />
            </View>
          </Marker>

          {mapSpots.filter(marker => marker?.status === filters.type).map(marker => (
            <Marker key={`marker-${marker._id}`} coordinate={{
              latitude: marker.location.coordinates[1],
              longitude: marker.location.coordinates[0],
            }}
              // onPress={() => this.props.navigation.navigate("Events", { _id: marker?._id })}
              title={marker.title}
              description={marker.description}
              icon={<Icon.FontAwesome name="map-marker" size={24} color={COLORS.red} />}
            >
              <View style={[styles.marker, styles[`${marker.status}Marker`]]}>
                <Image 
                  source={{ uri: marker.images[0] }}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
                />
              </View>
            </Marker>
          ))}
        </MapView>

      </View>
    );
  }

  renderTabs() {
    const { filters } = this.props;
    return (
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
      >
        <View
          style={[styles.tab, filters.type === "pending" ? styles.activeTab : null]}
        >
          <Text2
            style={[
              styles.tabTitle,
              filters.type === "pending" ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab("pending")}
          >
            Requested Events
          </Text2>
        </View>
        <View
          style={[
            styles.tab,
            filters.type === "approved" ? styles.activeTab : null
          ]}
        >
          <Text2
            style={[
              styles.tabTitle,
              filters.type === "approved" ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab("approved")}
          >
            Ongoing Events
          </Text2>
        </View>
        <View
          style={[styles.tab, filters.type === "completed" ? styles.activeTab : null]}
        >
          <Text2
            style={[
              styles.tabTitle,
              filters.type === "completed" ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab("completed")}
          >
            Past Events
          </Text2>
        </View>
        <View
          style={[styles.tab, filters.type === "rejected" ? styles.activeTab : null]}
        >
          <Text2
            style={[
              styles.tabTitle,
              filters.type === "rejected" ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab("rejected")}
          >
            Draft Events
          </Text2>
        </View>
      </ScrollView>
    );
  }

  renderList() {
    const { filters, campings } = this.props;
      function toRadians(degrees) {
        return degrees * Math.PI / 180;
      }
    
    function calculateDistance(lat1, lon1, lat2, lon2) {
      console.log(lat1, lon1, lat2, lon2)
      const earthRadius = 6371; // Radius of the Earth in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
    
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      const distance = earthRadius * c;
      return distance.toFixed(0) + " " + "kilometers"; // Distance in kilometers
    }


    return campings.filter(camping => camping?.status === filters.type).map(camping => {
      return (
        <View key={`camping-${camping._id}`} style={styles.camping}>
          <ImageBackground
            style={styles.campingImage}
            imageStyle={styles.campingImage}
            source={{ uri: camping.images[0] }}
          />

          <View style={styles.campingDetails}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Text2 style={{ fontSize: 14, fontWeight: "bold", color: COLORS.primary }}>
                {camping.title}
              </Text2>
              <Text style={{ fontSize: 12, color: "#A5A5A5", paddingTop: 5 }} multiline={true}>
                {camping.description ? camping.description : camping.landDesription}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.campingInfo}>
                <Icon.FontAwesome name="star" color="#FFBA5A" size={12} />
                <Text style={{ marginLeft: 4, color: "#FFBA5A" }}>
                  {camping.upvotes.length}
                </Text>
              </View>
              <View style={styles.campingInfo}>
                <Icon.FontAwesome
                  name="location-arrow"
                  color={"#FF7657"}
                  size={12}
                />
                <Text style={{ marginLeft: 4, color: "#FF7657" }}>
                  {calculateDistance(this.props.mylocation.latitude, this.props.mylocation.longitude, camping.location.coordinates[1], camping.location.coordinates[0])}
                </Text>
              </View>
              <View style={styles.campingInfo}>
                <Icon.Ionicons name="md-pricetag" color="black" size={12} />
                <Text style={{ marginLeft: 4, color: "black" }}>
                  {camping.favourites.length}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Events", { _id: camping?._id })}
            style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
          >
           <Icon.Ionicons name="ios-arrow-forward" color={COLORS.primary} size={24} />
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeader()}
        <ScrollView style={styles.container}>
          {this.renderMap()}
          {this.renderList()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const moduleState = state => ({
  campings: state.campings.spots,
  filters: state.campings.filters,
  mylocation: state.campings.location,
  data: state.data
});

const moduleActions = {
  setLocation,
  setCampings,
  setFilters
};

export default connect(moduleState, moduleActions)(Campings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    top: 0,
    height: height * 0.15,
    width: width
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.15,
    paddingHorizontal: 14,
    // backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#A5A5A5"

  },
  location: {
    height: 24,
    width: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary
  },
  marker: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  pendingMarker: {
    borderColor: COLORS.primary
  },
  approvedMarker: {
    borderColor: COLORS.green
  },
  rejectedMarker: {
    borderColor: COLORS.red
  },
  completedMarker: {
    borderColor: COLORS.gray
  },
  settings: {
    alignItems: "center",
    justifyContent: "center"
  },
  options: {
    flex: 1,
    paddingHorizontal: 14
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 14,
  },
  tab: {
    marginRight: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    paddingTop: 20,
    borderBottomColor: "transparent"
  },
  tabTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 10,
    color: COLORS.gray,
    letterSpacing: 0.5
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  activeTabTitle: {
    color: COLORS.primary
  },
  map: {
    flex: 1
  },
  camping: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "#A5A5A5",
    borderBottomWidth: 0.5,
    padding: 20
  },
  campingDetails: {
    flex: 2,
    paddingLeft: 20,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  campingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14
  },
  campingImage: {
    width: width * 0.3,
    height: width * 0.25,
    borderRadius: 6
  },
  myMarker: {
    zIndex: 2,
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(51, 83, 251, 0.2)"
  },
  myMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: "#3353FB"
  }
});
