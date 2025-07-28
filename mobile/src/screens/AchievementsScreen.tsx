import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import {
  useGetAchievementsQuery,
  useCompleteAchievementMutation,
} from '../store/gameApi';

const AchievementsScreen = () => {
  const { data: achievements, isLoading, error } = useGetAchievementsQuery();
  const [completeAchievement] = useCompleteAchievementMutation();

  const handleCompleteAchievement = async (achievementId: number) => {
    try {
      await completeAchievement(achievementId).unwrap();
    } catch (error) {
      console.error('Failed to complete achievement:', error);
    }
  };

  const renderAchievement = ({ item: achievement }: { item: any }) => {
    const progress = achievement.progress / achievement.requirement;
    const isCompleted = achievement.is_completed;

    return (
      <Card style={[styles.achievementCard, isCompleted && styles.completedCard]}>
        <Card.Content>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementIcon}>
              {isCompleted ? '✨' : '🏆'}
            </Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementCategory}>{achievement.category}</Text>
            </View>
            {isCompleted && (
              <Text style={styles.completedBadge}>✓</Text>
            )}
          </View>

          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                Progress: {achievement.progress}/{achievement.requirement}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <ProgressBar
              progress={progress}
              color={isCompleted ? '#4caf50' : '#4fc3f7'}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardText}>
              🎯 +{achievement.experience_reward} XP
            </Text>
            <Text style={styles.rewardText}>
              🪙 +{achievement.coin_reward} Coins
            </Text>
          </View>

          {!isCompleted && achievement.progress >= achievement.requirement && (
            <Button
              mode="contained"
              onPress={() => handleCompleteAchievement(achievement.id)}
              style={styles.claimButton}
            >
              Claim Reward
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load achievements</Text>
      </View>
    );
  }

  const completedCount = achievements?.filter(a => a.is_completed).length || 0;
  const totalCount = achievements?.length || 0;

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryText}>
            Achievements Completed: {completedCount}/{totalCount}
          </Text>
          <ProgressBar
            progress={totalCount > 0 ? completedCount / totalCount : 0}
            color="#4caf50"
            style={styles.summaryProgressBar}
          />
        </Card.Content>
      </Card>

      <FlatList
        data={achievements}
        renderItem={renderAchievement}
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
  loadingText: {
    color: '#8888aa',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 16,
  },
  summaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#1a1a2e',
    marginBottom: 12,
    borderRadius: 12,
  },
  completedCard: {
    backgroundColor: '#1e2a1e',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementCategory: {
    color: '#4fc3f7',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  completedBadge: {
    color: '#4caf50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: '#8888aa',
    fontSize: 12,
  },
  progressPercent: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  rewardText: {
    color: '#4fc3f7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#4fc3f7',
  },
});

export default AchievementsScreen;