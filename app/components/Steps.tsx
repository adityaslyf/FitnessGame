import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CALORIES_PER_STEP = 0.05;
const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const storedSteps = await AsyncStorage.getItem('steps');
    let steps = storedSteps ? parseInt(storedSteps) : 0;

    // Simulate step counting in background
    steps += Math.floor(Math.random() * 10); // Add 0-9 steps randomly

    await AsyncStorage.setItem('steps', steps.toString());

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const Pedo = () => {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  useEffect(() => {
    registerBackgroundFetch();
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
  }, [isCounting, lastY, lastTimestamp]);

  const registerBackgroundFetch = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (err) {
      console.log("Task Registration failed:", err);
    }
  };

  const loadSteps = async () => {
    try {
      const storedSteps = await AsyncStorage.getItem('steps');
      if (storedSteps !== null) {
        setSteps(parseInt(storedSteps));
      }
    } catch (error) {
      console.log("Error loading steps:", error);
    }
  };

  const incrementSteps = async () => {
    try {
      const newSteps = steps + 1;
      setSteps(newSteps);
      await AsyncStorage.setItem('steps', newSteps.toString());
    } catch (error) {
      console.log("Error saving steps:", error);
    }
  };

  const resetSteps = async () => {
    try {
      setSteps(0);
      await AsyncStorage.setItem('steps', '0');
    } catch (error) {
      console.log("Error resetting steps:", error);
    }
  };

  const estimatedCalories = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
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
