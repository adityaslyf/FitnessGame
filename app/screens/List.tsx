// app/screens/List.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../Firebase";
import GameCard from "../components/GameCard";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGames = async (page: number) => {
    setLoading(true);
    // Simulate fetching data from an API
    const newGames = [
      {
        id: `${page}-1`,
        title: `Game ${page}-1`,
        description: "This is the description of the game.",
        imageUrl: "https://via.placeholder.com/150",
      },
      // Add more mock games here
    ];
    setGames((prevGames) => [...prevGames, ...newGames]);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const renderGameCard = ({ item }: { item: any }) => (
    <GameCard
      title={item.title}
      description={item.description}
      imageUrl={item.imageUrl}
      onPress={() => navigation.navigate("details", { gameId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Button title="Loading..." disabled /> : null}
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
});

export default List;
