import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';

const GameDashboard = ({ navigation }) => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);
    };

    checkPedometerAvailability();

    const subscription = Pedometer.watchStepCount(result => {
      setStepCount(result.steps);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Dashboard</Text>
      <Text style={styles.stepCount}>
        Steps taken: {stepCount}
      </Text>
      {!isPedometerAvailable && (
        <Text style={styles.error}>Pedometer is not available on this device.</Text>
      )}
      <Button title="Back to Details" onPress={() => navigation.goBack()} />
    </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  stepCount: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default GameDashboard;
