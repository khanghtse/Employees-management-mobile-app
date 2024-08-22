import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

const employees = () => {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.log("Error fetching employee data", error);
      }
    };
    fetchEmployeeData();
  }, []);
  console.log(employees);
  return (
    <View style={{ flex: 1, backgroundColor: " white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Ionicons
          style={{ marginLeft: 10 }}
          name="arrow-back"
          size={24}
          color="black"
        />
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            height: 40,
            borderRadius: 4,
          }}
        >
          <AntDesign name="search1" size={20} color="black" />
          <TextInput placeholder="Search" />
        </Pressable>
      </View>
    </View>
  );
};

export default employees;

const styles = StyleSheet.create({});
