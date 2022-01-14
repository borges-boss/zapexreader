import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

const FloatingActionButton = props => {
  return (
    <TouchableOpacity onPress={() => {
      if (props.onPress !== undefined) {
        props.onPress();
      }
    }} style={{
      width: 60,
      height: 60,
      position: "absolute",
      backgroundColor: props.backgroundColor,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      bottom: 16,
      right: 16,
    }}>
      <MaterialCommunityIcons name={props.icon} size={24} color={props.iconColor} />
    </TouchableOpacity>);
};


export default FloatingActionButton;
