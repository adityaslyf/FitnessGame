import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase';
import { collection, query, getDocs } from "firebase/firestore"; 

const Dashboard = ({ navigation }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const challengesRef = collection(FIREBASE_DB, `users/${user.uid}/challenges`);
          const q = query(challengesRef);
          const querySnapshot = await getDocs(q);
          const challengesList = querySnapshot.docs.map(doc => doc.data());
          setChallenges(challengesList);
        }
      } catch (error) {
        console.error("Error fetching challenges: ", error);
      }
    };

    fetchChallenges();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.challengeItem}>
      <Text style={styles.challengeTitle}>{item.challengeTitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Challenges</Text>
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={(item) => item.challengeId}
      />
    </View>
  );
};

export default Dashboard;

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
  challengeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  challengeTitle: {
    fontSize: 18,
  },
});
