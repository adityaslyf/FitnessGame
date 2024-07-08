import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../Firebase";

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: string;
  // Add more fields as needed
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List: React.FC<RouterProps> = ({ navigation }) => {
  // Example list of challenges
  const challenges: Challenge[] = [
    {
      id: "1",
      title: "Sample Challenge 1",
      description: "This is a Step counter Game Challnege , You can count the number of steps and caloires burned.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo2TQAjTLaCKCAq0JRbrIZLu9QuFgwiJ5GXQ&s",
    },
    {
      id: "2",
      title: "Sample Challenge 2",
      description: "Increase your daily steps and track your progress with this engaging challenge.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo2TQAjTLaCKCAq0JRbrIZLu9QuFgwiJ5GXQ&s",
    },
    {
      id: "3",
      title: "Sample Challenge 3",
      description: "Join this challenge to achieve your fitness goals through fun and interactive activities.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo2TQAjTLaCKCAq0JRbrIZLu9QuFgwiJ5GXQ&s",
    },
    // Add more challenges as needed
  ];
  

  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate("details", {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      challengeDescription: challenge.description,
      challengeImage: challenge.image,
      // Add more fields as needed
    });
  };

  const renderChallengeCard = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleChallengePress(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.myChallengesButton]} onPress={() => navigation.navigate("dashboard")}>
          <Text style={styles.buttonText}>My Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => FIREBASE_AUTH.signOut()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  cardList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 8,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  myChallengesButton: {
    marginRight: "2%",
  },
  logoutButton: {
    marginLeft: "2%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default List;
