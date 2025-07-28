import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useGetTeaCardsQuery } from '../store/gameApi';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const CollectionScreen = () => {
  const { data: teaCards, isLoading, error } = useGetTeaCardsQuery();

  const renderTeaCard = ({ item: card }: { item: any }) => (
    <Card style={[styles.teaCard, { width: cardWidth }]}>
      <Card.Content>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardRarity}>{card.rarity}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Strength:</Text>
            <Text style={styles.statValue}>{card.strength}/10</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Freshness:</Text>
            <Text style={styles.statValue}>{card.freshness}/10</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Aroma:</Text>
            <Text style={styles.statValue}>{card.aroma}/10</Text>
          </View>
        </View>

        {card.abilities && card.abilities.length > 0 && (
          <View style={styles.abilitiesContainer}>
            {card.abilities.map((ability: string, index: number) => (
              <Text key={index} style={styles.ability}>
                {ability}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.brewingInfo}>
          <Text style={styles.brewingText}>🌡️ {card.brewing_temperature}</Text>
          <Text style={styles.brewingText}>⏱️ {card.brewing_time}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading tea collection...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load tea cards</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Tea Collection ({teaCards?.length || 0} cards)
      </Text>
      
      <FlatList
        data={teaCards}
        renderItem={renderTeaCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    color: '#8888aa',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  teaCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 16,
    borderRadius: 12,
  },
  cardName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardRarity: {
    color: '#4fc3f7',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statsContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    color: '#8888aa',
    fontSize: 12,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  ability: {
    backgroundColor: '#333355',
    color: '#ffffff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  brewingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brewingText: {
    color: '#8888aa',
    fontSize: 10,
  },
});

export default CollectionScreen;