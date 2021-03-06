import React, { useState } from "react";
import * as firebase from "firebase";
import { View, FlatList, Picker, StyleSheet, Text, Button } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import FormInput from "../components/FormInput";
import CardSchedule from "../components/CardSchedule";

const Verified = ({ navigation }) => {
  var verified = [];
  var dbRef = firebase.database().ref("/admin/Verified/");
  dbRef.on("value", function (snapshot) {
    const data = snapshot.val();
    for (var key in data) {
      if (data.hasOwnProperty(key)) { 
        var val = data[key];
          let user = {
            id:
              new Date().getTime().toString() +
              Math.floor(
                Math.random() * Math.floor(new Date().getTime())
              ).toString(),
            orderid: val["orderId"],
            userid: val["userId"],
            staffid: val["staffId"],
          };
          verified.push(user);
        }
      }});
  const [user_id, setuserid] = useState();
  const [order_id, setorderid] = useState();
  const [arrHolder, setarrHolder] = useState( verified);
  // const [data_history, setdata_history] = useState(users);
  var data_history =  verified;
  const [PickerSelectedVal, setPickerSelectedVal] = useState("orderid");
  const [PickerSelectedVal1, setPickerSelectedVal1] = useState("ascending");
  const Check = (user_id, order_id, item) => {
    setuserid(user_id);
    setorderid(order_id);
    navigation.navigate("VerifiedOrder", {
      user_id: user_id,
      order_id: order_id,
      //screen: "Orders",
    });
  };

  const filter_func = (text) => {
    const newData = data_history.filter((items) => {
      var order = items[`${PickerSelectedVal}`];
      if (
        PickerSelectedVal == "prior_booking" ||
        PickerSelectedVal == "insurance"
      ) {
        if (items[`${PickerSelectedVal}`]) order = "Yes";
        else order = "No";
      }
      return order.includes(text);
    });
    if (PickerSelectedVal1 == "ascending") {
      newData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a["time"]) - new Date(b["time"]);
      });
      console.log(newData);
    }
    if (PickerSelectedVal1 == "descending") {
      newData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b["time"]) - new Date(a["time"]);
      });
      console.log(newData);
    }
    setarrHolder(newData);
  };
  return (
    <View
      style={{
        backgroundColor: "#f8f4f4",
        padding: 20,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.buttonStyle}>
        <Text style={[styles.text, { marginTop: 20, flexDirection: "row" }]}>Filter By</Text>
      <Picker
        selectedValue={PickerSelectedVal}
        style={[styles.inputsingle, { height: 50, width: 155 }]}
        onValueChange={(itemValue, itemIndex) =>
          setPickerSelectedVal(itemValue)
        }
      >
        <Picker.Item
          label="Order ID"
          value="orderid"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="User ID"
          value="userid"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="Category"
          value="category"
          style={styles.labelPicker}
        />
        <Picker.Item label="Type" value="type" style={styles.labelPicker} />
        <Picker.Item
          label="Insurance"
          value="insurance"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="Priority Booking"
          value="prior_booking"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="Pincode(Delivery)"
          value="pc_del"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="Pincode(Pickup)"
          value="pc_pick"
          style={styles.labelPicker}
        />
      </Picker>
      </View>
      <View style={styles.buttonStyle}>
      <Text style={[styles.text, { marginTop: 20, flexDirection: "row" }]}> Filter by time</Text>
      <Picker
        selectedValue={PickerSelectedVal1}
        style={[styles.inputsingle, { height: 50, width: 200 }]}
        onValueChange={(itemValue, itemIndex) =>
          setPickerSelectedVal1(itemValue)
        }
      >
        <Picker.Item
          label="Ascending"
          value="ascending"
          style={styles.labelPicker}
        />
        <Picker.Item
          label="Descending"
          value="descending"
          style={styles.labelPicker}
        />
      </Picker>
      </View>
    </View>
      <FormInput
        onChangeText={(text) => filter_func(text)}
        placeholderText="Search..."
        iconType="search1"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FlatList
        data={arrHolder}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={Check.bind(this, item.userid, item.orderid)}
          >
            <CardSchedule
              userId={item.userid}
              orderId={item.orderid}
              staffId={item.staffid}
            />
          </TouchableOpacity>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default Verified;

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
});
