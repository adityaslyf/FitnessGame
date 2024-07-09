import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Pedo from '../components/Steps';

interface Props {
  route: {
    params: {
      challengeId: string;
      challengeTitle: string;
      challengeDescription: string;
      challengeImage: string;
    };
  };
  navigation: any;
}

const Details: React.FC<Props> = ({ route, navigation }) => {
  const { challengeId, challengeTitle, challengeDescription, challengeImage } = route.params;
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    checkIfJoined();
  }, []);

  const checkIfJoined = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userChallengeRef = doc(FIREBASE_DB, `users/${user.uid}/challenges/${challengeId}`);
      const docSnap = await getDoc(userChallengeRef);
      setIsJoined(docSnap.exists());
    }
  };

  const joinChallenge = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userChallengesRef = doc(FIREBASE_DB, `users/${user.uid}/challenges/${challengeId}`);
        await setDoc(userChallengesRef, {
          challengeId,
          challengeTitle,
          joinedAt: new Date().toISOString(),
          steps: 0, // Initialize steps to 0
        });
        Alert.alert('Success', 'You have joined the challenge!');
        setIsJoined(true);
      } else {
        Alert.alert('Error', 'You need to be logged in to join a challenge.');
      }
    } catch (error) {
      console.error('Error joining challenge: ', error);
      Alert.alert('Error', 'Failed to join the challenge.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={{ uri: challengeImage }} style={styles.image} />
        <Text style={styles.title}>{challengeTitle}</Text>
        <Text style={styles.description}>{challengeDescription}</Text>
        {!isJoined && (
          <Button title="Join Challenge" onPress={joinChallenge} color="#007bff" />
        )}
        
        {isJoined && (
          <View style={styles.stepsContainer}>
            <Pedo challengeId={challengeId} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5', // Add a light background color
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400, // Example max width to limit content width
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth: 1, // Add a border to the image
    borderColor: '#007bff', // Make the border blue
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007bff', // Make the title blue
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // Make the description a dark gray
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: '#fff', // Add a white background to the steps container
  },
  stepsText: {
    fontSize: 16,
    marginRight: 10,
    color: '#007bff', // Make the steps text blue
  },
  pedo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default Details;
