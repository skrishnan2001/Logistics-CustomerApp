import React, { useState } from "react";
import * as firebase from "firebase";
import Cards from "../components/Cards";
import FormButton from "../components/FormButton";
import { View, FlatList, TextInput, StyleSheet, Text, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import FormInput from "../components/FormInput";
import { db } from "../firebaseConfig";
import DropDownPicker from 'react-native-dropdown-picker';


const Sort = ({ navigation }) => {
  var users = [];
  const [staff_picker, setstaff_picker] = useState("Staff 1");
  const [Shift, setshift_picker] = useState("Shift 1");
  users = [];
  var dbRef = firebase.database().ref("/users/booking/");
  dbRef.on("value", function (snapshot) {
    const data = snapshot.val();
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var val = data[key];
        for (var key_2 in val) {
          if (val.hasOwnProperty(key_2)) {
            var val_2 = val[key_2];
            if (val_2["isScheduled"] == "Not Yet Scheduled") {
              let user = {
                id:
                  new Date().getTime().toString() +
                  Math.floor(
                    Math.random() * Math.floor(new Date().getTime())
                  ).toString(),
                userid: key,
                orderid: key_2,
                city_pickup: val_2["city_pickup"],
                state_pickup: val_2["state_pickup"],
                city_delivery: val_2["city_delivery"],
                state_delivery: val_2["state_delivery"],
                pc_del: val_2["pincode_delivery"],
                pc_pick: val_2["pincode_pickup"],
                time: val_2["Time"],
              };
              users.push(user);
            }
          }
        }
      }
    }
  });
  var staff = {};
  var dbRef = db.ref("/staff/ProfileDetails/");
  dbRef.on("value", function (snapshot) {
    const data = snapshot.val();
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var val = data[key];
        var id = key;
        staff[`${val["Name"]}`] = id;
      }
    }
  });

  var staffs = [];

  var shifts = [
    { label: 'Shift 1' },
    { label: 'Shift 2' },
    { label: 'Shift 3' },
  ];

  const test = () => {
    arrHolder.forEach((obj) => {
      var userId = obj["userid"];
      var orderId = obj["orderid"];
      db.ref(`/users/booking/${userId}/${orderId}`).update({
        isScheduled: "Undelivered",
        StaffId: staff[staff_picker],
      });
      db.ref(`staff/Undelivered/${staff[staff_picker]}/`).push({
        userId: userId,
        orderId: orderId,
        Shift: Shift,
      });
      db.ref(`admin/ScheduledOrders/${Shift}/`).push({
        StaffId: staff[staff_picker],
        userId: userId,
        orderId: orderId,
      });
    });
    Alert.alert("The orders have been scheduled");
    setarrHolder([]);
    staffs = [];
    setWeight("");
    setVolume("");
  };
  const [user_id, setuserid] = useState();
  const [order_id, setorderid] = useState();
  const [arrHolder, setarrHolder] = useState(users);
  const [volume, setVolume] = useState();
  const [weight, setWeight] = useState();
  var vehicle_type = "";
  // const [data_history, setdata_history] = useState(users);
  var data_history = users;
  const Check = (user_id, order_id, item) => {
    setuserid(user_id);
    setorderid(order_id);
    navigation.navigate("Invoice", { user_id: user_id, order_id: order_id });
  };



  // const [state, setstate] = useState();
  // const [city, setcity] = useState();
  // const [pincode, setpincode] = useState();

  const filter_func = (text1) => {
    data_history = users;
    const newData = data_history.filter((items) => {
      var order = items.state_pickup;
      var order1 = items.city_pickup;
      var order2 = items.pc_pick;
      return (
        order.includes(text1) ||
        order1.includes(text1) ||
        order2.includes(text1)
      );
    });
    setarrHolder(newData);
  };

  const VehiclePicker = () => {
    if (volume < 3 || weight < 5) {
      vehicle_type = "two-wheeler";
    } else if ((volume >= 3 && volume < 7) || (weight >= 5 && weight < 50)) {
      vehicle_type = "four-wheeler";
    } else if ((volume >= 7 && volume < 12) || (weight >= 50 && weight < 100)) {
      vehicle_type = "mini-van";
    } else {
      vehicle_type = "truck";
    }
    console.log(vehicle_type);
    var dbRef = firebase.database().ref("/staff/ProfileDetails/");
    dbRef.on("value", function (snapshot) {
      const data = snapshot.val();
      for (var key in data) {
        var val = data[key];
        if (val["Vehicle_Type"] === vehicle_type) {
          let staff = {
            staff_id: key,
            label: val["Name"]
          };
          staffs.push(staff);
        }
      }
    });
    console.log(staffs);
  };
  var count = 0;
  for (var j in arrHolder) {
    if (arrHolder.hasOwnProperty(j)) {
      count += 1;
    }
  }
  return (
    <View
      style={{
        backgroundColor: "#f8f4f4",
        padding: 20,
        flex: 1,
      }}
    >
      <Text style={[styles.text, { marginTop: 20 }]}>Search Filter</Text>

      <FormInput
        onChangeText={(text) => filter_func(text)}
        placeholderText="State"
        iconType="search1"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        onChangeText={(text) => filter_func(text)}
        placeholderText="City"
        iconType="search1"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        onChangeText={(text) => filter_func(text)}
        placeholderText="Pincode"
        iconType="search1"
        autoCapitalize="none"
        keyboardType="number-pad"
        autoCorrect={false}
        maxLength={6}
      />

      {/* <FormButton
        buttonTitle="Sort"
        onPress={filter_func.bind(this, state, city, pincode)}
      /> */}
      <View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.buttonStyle}>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(text) => setVolume(text)}
                style={styles.input}
                placeholderText="Volume"
                numberOfLines={1}
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="number-pad"
                autoCorrect={false}
                maxLength={6}
              />
            </View>
          </View>
          <View style={styles.buttonStyle}>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(text) => setWeight(text)}
                style={styles.input}
                placeholderText="Weight"
                numberOfLines={1}
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="number-pad"
                autoCorrect={false}
                maxLength={6}
              />
            </View>
          </View>
          <View style={styles.buttonStyle}>
            <FormButton buttonTitle="Filter" onPress={VehiclePicker} />
          </View>

        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.buttonStyle}>
            <DropDownPicker
              items={staffs}
              placeholder="Select Staff"
              onChangeItem={item => setstaff_picker(item.label)}
              containerStyle={{ marginTop: 10, height: 50, width: 100 }}
              labelStyle={{ color: '#2e64e5' }}
            />
          </View>
          <View style={styles.buttonStyle}>
            <DropDownPicker
              items={shifts}
              placeholder="Select Shift"
              onChangeItem={item => setshift_picker(item.label)}
              containerStyle={{ marginTop: 10, height: 50, width: 100 }}
              labelStyle={{ color: '#2e64e5' }}
              itemStyle={{ borderColor: 'black', borderWidth: 1, }}
            />
          </View>
          <View style={styles.buttonStyle}>
            <FormButton buttonTitle="Schedule" onPress={test} />
          </View>
        </View>
      </View>

      <Text style={[styles.text, { marginTop: 20 }]}>
        Number of orders is {count}
      </Text>
      <FlatList
        data={arrHolder}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={Check.bind(this, item.userid, item.orderid)}
          >
            <Cards userId={item.userid} orderId={item.orderid} />
          </TouchableWithoutFeedback>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default Sort;

const styles = StyleSheet.create({
  inputsingle: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 5,
    marginTop: 10,
    borderRadius: 125,
    marginBottom: 5,
    width: 250,
    height: 30,
    color: "#2e64e5",
    backgroundColor: "#465881",
  },
  labelPicker: {
    fontSize: 18,
  },
  text: {
    color: "#051d5f",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonStyle: {
    marginHorizontal: "2%",
    marginVertical: 10,
    width: "30%",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,

    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});