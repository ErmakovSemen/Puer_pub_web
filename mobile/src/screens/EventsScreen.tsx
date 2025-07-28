import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useGetWeeklyEventsQuery } from '../store/gameApi';

const EventsScreen = () => {
  const { data: events, isLoading, error } = useGetWeeklyEventsQuery();

  const renderEvent = ({ item: event }: { item: any }) => (
    <Card style={styles.eventCard}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text style={styles.eventDay}>{event.day_of_week}</Text>
          <Text style={styles.eventTime}>
            {event.start_time} - {event.end_time}
          </Text>
        </View>
        
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward:</Text>
          <Text style={styles.rewardText}>
            {event.reward_type === 'coins' ? '🪙' : '🎯'} +{event.reward_amount} {event.reward_type}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading weekly events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load events</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Weekly Events Schedule</Text>
      
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 12,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDay: {
    color: '#4fc3f7',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventTime: {
    color: '#8888aa',
    fontSize: 12,
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 12,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLabel: {
    color: '#8888aa',
    fontSize: 12,
  },
  rewardText: {
    color: '#4fc3f7',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EventsScreen;