from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TeaCard, Player, UserCard, Quest, Achievement, WeeklyEvent
from .serializers import (
    TeaCardSerializer, PlayerSerializer, UserCardSerializer,
    QuestSerializer, AchievementSerializer, WeeklyEventSerializer
)


class TeaCardViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for tea cards"""
    queryset = TeaCard.objects.all()
    serializer_class = TeaCardSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    """API endpoint for player data"""
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current player data - simplified for migration"""
        try:
            # For now, get the first player (will implement proper auth later)
            player = Player.objects.first()
            if not player:
                return Response({'error': 'No player found'}, status=404)
            
            serializer = self.get_serializer(player)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class UserCardViewSet(viewsets.ModelViewSet):
    """API endpoint for user's card collection"""
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer

    def get_queryset(self):
        # For now, return cards for first player
        player = Player.objects.first()
        if player:
            return UserCard.objects.filter(user=player)
        return UserCard.objects.none()


class QuestViewSet(viewsets.ModelViewSet):
    """API endpoint for quests"""
    queryset = Quest.objects.all()
    serializer_class = QuestSerializer

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a quest and award rewards"""
        quest = self.get_object()
        player = Player.objects.first()  # Simplified for migration
        
        if not quest.is_completed and player:
            quest.is_completed = True
            quest.save()
            
            # Award rewards
            player.experience += quest.experience_reward
            player.coins += quest.coin_reward
            
            # Level up logic
            if player.experience >= player.level * 1000:
                player.level += 1
                
            player.save()
            
            serializer = self.get_serializer(quest)
            return Response(serializer.data)
        
        return Response({'error': 'Quest already completed'}, status=400)


class AchievementViewSet(viewsets.ModelViewSet):
    """API endpoint for achievements"""
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

    def get_queryset(self):
        # For now, return achievements for first player
        player = Player.objects.first()
        if player:
            return Achievement.objects.filter(user=player)
        return Achievement.objects.none()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete an achievement and award rewards"""
        achievement = self.get_object()
        
        if not achievement.is_completed:
            achievement.is_completed = True
            achievement.save()
            
            # Award rewards
            player = achievement.user
            player.experience += achievement.experience_reward
            player.coins += achievement.coin_reward
            
            # Level up logic
            if player.experience >= player.level * 1000:
                player.level += 1
                
            player.save()
            
            serializer = self.get_serializer(achievement)
            return Response(serializer.data)
        
        return Response({'error': 'Achievement already completed'}, status=400)


class WeeklyEventViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for weekly events"""
    queryset = WeeklyEvent.objects.all()
    serializer_class = WeeklyEventSerializer