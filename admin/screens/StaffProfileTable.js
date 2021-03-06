import React, { useContext, useState, Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";
import * as firebase from "firebase";
import { db } from "../firebaseConfig";
import { windowHeight, windowWidth } from "../utils/Dimensions";

const StaffProfileTable = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  var path = "";
  var phone,
    StaffName,
    vehicleNum,
    vehicle_type,
    AadharNo;
  const { user_id  } = route.params;
  var bookingRef = firebase
    .database()
    .ref(`/staff/ProfileDetails/${user_id}`);
    bookingRef.on("value", function (data) {
    var newBooking = data.val();
    StaffName = newBooking.Name;
    phone = newBooking.Phone_number;
    vehicleNum = newBooking.VehicleNum
    vehicle_type = newBooking.Vehicle_Type
    AadharNo=newBooking.aadharNo
  });
  const [curr, next] = useState({
    tableHead: ["", "Details"],
    tableTitle: [
      "Name",
      "Phone No.",
      "Vehicle Number",
      "Vehicle Type",
      "Aadhaar Number"
    ],
    tableData: [
      [`${StaffName}`],
      [`${phone}`],
      [`${vehicleNum}`],
      [`${vehicle_type}`],
      [`${AadharNo}`]
    ],
  });

  const state = curr;
  return (
      <View style={styles.container}>
        <Text style={styles.top}>Staff Profile</Text>
        <Table borderStyle={{ borderWidth: 2 }}>
          <Row
            data={state.tableHead}
            flexArr={[0, 2.02, 0, 0]}
            style={styles.head}
            textStyle={styles.text}
          />
          <TableWrapper style={styles.wrapper}>
            <Col
              data={state.tableTitle}
              style={styles.title}
              heightArr={[60, 60, 60]}
              textStyle={styles.text}
            />
            <Rows
              data={state.tableData}
              flexArr={[0, 0, 2]}
              style={styles.row}
              textStyle={styles.text}
            />
          </TableWrapper>
        </Table>
        {/* <FormButton
          buttonTitle={"Back"}
          onPress={() => navigation.goBack()}
        /> */}
        <FormButton
          buttonTitle={"Track Staff"}
          onPress={()=> navigation.navigate("TrackStaff", { user: user_id })}
        />
      </View>
  );
};

export default StaffProfileTable ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#f6f8fa" },
  row: { height: 60 },
  text: { textAlign: "center" },
  top: {
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 20,
    color: "#051d5f",
  },
  image: {
    marginBottom: "5%",
    marginTop: "5%",
    textAlign: "center",
    color: "#c43d10",
    fontSize: 20,
    fontFamily: "serif",
  },
});
