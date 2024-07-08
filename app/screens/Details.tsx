import React from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import Pedo from '../components/Steps'

interface Props {
  route: {
    params: {
      challengeId: string;
      challengeTitle: string;
      challengeDescription: string;
      challengeImage: string;
      // Add more fields as needed
    };
  };
  navigation: any; // Adjust type as per your navigation setup
}

const Details: React.FC<Props> = ({ route, navigation }) => {
  const { challengeId, challengeTitle, challengeDescription, challengeImage } = route.params;

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
      console.error('Error joining challenge: ', error);
      Alert.alert('Error', 'Failed to join the challenge.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: challengeImage }} style={styles.image} />
      <Text style={styles.title}>{challengeTitle}</Text>
      <Text style={styles.description}>{challengeDescription}</Text>
      <Button title="Join Challenge" onPress={joinChallenge} />
      
      {/* Include Pedo component here */}
      <Pedo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Details;
