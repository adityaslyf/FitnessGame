import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const CALORIES_PER_STEP = 0.05;

interface PedoProps {
  challengeId: string;
}

const Pedo: React.FC<PedoProps> = ({ challengeId }) => {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  useEffect(() => {
    loadSteps();
    let subscription;

    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 1.0;
          const timestamp = new Date().getTime();
          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            timestamp - lastTimestamp > 800
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timestamp);
            incrementSteps();

            setTimeout(() => {
              setIsCounting(false);
            }, 1200);
          }
        });
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimestamp, challengeId]);

  const loadSteps = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userChallengeRef = doc(FIREBASE_DB, `users/${user.uid}/challenges/${challengeId}`);
      const docSnap = await getDoc(userChallengeRef);
      if (docSnap.exists()) {
        setSteps(docSnap.data().steps || 0);
      }
    }
  };

  const incrementSteps = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const newSteps = steps + 1;
      setSteps(newSteps);
      const userChallengeRef = doc(FIREBASE_DB, `users/${user.uid}/challenges/${challengeId}`);
      await updateDoc(userChallengeRef, { steps: newSteps });
    }
  };

  const estimatedCalories = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Challenge Progress</Text>
      <View style={styles.stepContainer}>
        <Text style={styles.stepsLabel}>{steps}</Text>
        <Text style={styles.stepsText}>Steps</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.caloriesLabel}>{estimatedCalories.toFixed(2)}</Text>
        <Text style={styles.caloriesText}>kcal Estimated</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepContainer: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsLabel: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  stepsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  caloriesLabel: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  caloriesText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Pedo;
