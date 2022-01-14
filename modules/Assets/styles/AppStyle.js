import React from "react";
import { StyleSheet } from "react-native";


const AppStyle = StyleSheet.create({

  defaultFont:{
    fontFamily:"FreightSansProBook-Regular",
  },
  container: {
    padding: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    fontWeight: "600",
    color: "black",
    padding: 8,//#eaeaea #C4C4C4
    backgroundColor: "#C4C4C4",
    opacity: 0.45,
    height: 40,
    width: 350,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "transparent",
    borderWidth: 1,
  },
  button: {
    width: 180,
    padding: 8,
    color: "#fff",
    borderRadius: 16,
  },
  text: {
    fontSize: 14,
    color: "#030305",
    fontWeight: "normal",
  },
  textTitle: {
    fontSize: 32,
    color: "#262626",
    fontWeight: "600",
  },
  textSubtitle: {
    fontSize:18,
    color: "#262626",
    opacity: 0.5,
  },
  card: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 4,
  },
});


export default AppStyle;
