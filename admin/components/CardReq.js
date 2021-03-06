import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

function CardReq({ staffId, Reason }) {
  return (
    <View style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#051d5f" }}>
          Staff Id
        </Text>
        <Text style={{ fontSize: 15, color: "#2f4f4f" }}>{staffId}</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#051d5f",
            marginTop: 10,
          }}
        >
          Reason
        </Text>
        <Text style={{ fontSize: 15, color: "#2f4f4f" }}>{Reason}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    overflow: "hidden",
    padding: 20,
  },
  detailsContainer: {
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: 200,
  },
});

export default CardReq;
