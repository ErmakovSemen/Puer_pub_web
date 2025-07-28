import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {
  useGetCurrentPlayerQuery,
  useGetQuestsQuery,
  useGetAchievementsQuery,
  useCompleteQuestMutation,
} from '../store/gameApi';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { data: player } = useGetCurrentPlayerQuery();
  const { data: quests } = useGetQuestsQuery();
  const { data: achievements } = useGetAchievementsQuery();
  const [completeQuest] = useCompleteQuestMutation();

  const handleCompleteQuest = async (questId: number) => {
    try {
      await completeQuest(questId).unwrap();
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const completedAchievements = achievements?.filter(a => a.is_completed) || [];
  const progressPercent = player ? (player.experience % 1000) / 10 : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Player Stats Header */}
      <Card style={styles.playerCard}>
        <Card.Content>
          <View style={styles.playerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{player?.level || 1}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>XP</Text>
              <Text style={styles.statValue}>{player?.experience || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Coins</Text>
              <Text style={styles.statValue}>{player?.coins || 0}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </Card.Content>
      </Card>

      {/* Navigation Cards */}
      <View style={styles.navigationGrid}>
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate('Collection' as never)}
        >
          <Text style={styles.navCardTitle}>🍃 Collection</Text>
          <Text style={styles.navCardSubtitle}>View your tea cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate('Achievements' as never)}
        >
          <Text style={styles.navCardTitle}>🏆 Achievements</Text>
          <Text style={styles.navCardSubtitle}>{completedAchievements.length} completed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate('Events' as never)}
        >
          <Text style={styles.navCardTitle}>📅 Events</Text>
          <Text style={styles.navCardSubtitle}>Weekly challenges</Text>
        </TouchableOpacity>
      </View>

      {/* Active Quests */}
      <Text style={styles.sectionTitle}>Active Quests</Text>
      {quests?.slice(0, 3).map((quest) => (
        <Card key={quest.id} style={styles.questCard}>
          <Card.Content>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDescription}>{quest.description}</Text>
            <View style={styles.questRewards}>
              <Text style={styles.rewardText}>+{quest.experience_reward} XP</Text>
              <Text style={styles.rewardText}>+{quest.coin_reward} Coins</Text>
            </View>
            {!quest.is_completed && (
              <Button
                mode="contained"
                onPress={() => handleCompleteQuest(quest.id)}
                style={styles.completeButton}
              >
                Complete Quest
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 16,
  },
  playerCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 20,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#8888aa',
    fontSize: 12,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333355',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4fc3f7',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navCard: {
    width: width / 2 - 24,
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  navCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navCardSubtitle: {
    color: '#8888aa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 12,
  },
  questTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 12,
  },
  questRewards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  rewardText: {
    color: '#4fc3f7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4fc3f7',
  },
});

export default HomeScreen;