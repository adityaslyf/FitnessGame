import { View, Button } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../Firebase";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={() =>
          navigation.navigate("details", {
            challengeId: "1",
            challengeTitle: "Sample Challenge",
           
          })
        }
        title="Open Details"
      />
      <Button onPress={() => navigation.navigate("dashboard")} title="My Challenges" />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

export default List;
