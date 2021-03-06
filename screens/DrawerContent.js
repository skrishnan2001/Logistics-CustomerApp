import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../navigation/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../firebaseConfig";

//import{ AuthContext } from '../components/context';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const { user, logout } = useContext(AuthContext);
  //const { signOut, toggleTheme } = React.useContext(AuthContext);
  const [name, setName] = useState("Customer Name");
  const [username, setusername] = useState("user_name");
  const [image, setimage] = useState(null);
  var key;
  var ref = db.ref(`/users/ProfileDetails/${user.uid}`);
  ref.once("value").then(function (snapshot) {
    ref.limitToLast(1).on("child_added", function (snapshot) {
      key = snapshot.key;
    });
    const data = snapshot.val()[key];
    setName(data["Name"]);
    setusername(data["User_name"]);
    setimage(data["Img_uri"]);
  });
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: `data:image/jpeg;base64,${image}`,
                }}
                size={50}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>{name}</Title>
                <Caption style={styles.caption}>{username}</Caption>
              </View>
            </View>

            {/* <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View> */}
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              label="Booking"
              onPress={() => {
                props.navigation.navigate("Booking");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="crosshairs-gps" color={color} size={size} />
              )}
              label="Track"
              onPress={() => {
                props.navigation.navigate("Track");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
          </Drawer.Section>
          {/* <Drawer.Section title="Preferences">
                        <TouchableRipple /*onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => logout()}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    //borderColor: '#f4f4f4',
    //borderWidth: 0.3,
    backgroundColor: "#d1d1d1",
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
