import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase';
import { doc, setDoc } from "firebase/firestore"; 

const Details = ({ route, navigation }) => {
  const { challengeId, challengeTitle } = route.params;

  const joinChallenge = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userChallengesRef = doc(FIREBASE_DB, `users/${user.uid}/challenges/${challengeId}`);
        await setDoc(userChallengesRef, {
          challengeId,
          challengeTitle,
          joinedAt: new Date().toISOString(),
        });
        Alert.alert('Success', 'You have joined the challenge!');
      } else {
        Alert.alert('Error', 'You need to be logged in to join a challenge.');
      }
    } catch (error) {
      console.error("Error joining challenge: ", error);
      Alert.alert('Error', 'Failed to join the challenge.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{challengeTitle}</Text>
      <Button title="Join Challenge" onPress={joinChallenge} />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
