from rest_framework import serializers
from .models import TeaCard, Player, UserCard, Quest, Achievement, WeeklyEvent


class TeaCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeaCard
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'level', 'experience', 'coins']


class UserCardSerializer(serializers.ModelSerializer):
    tea_card = TeaCardSerializer(read_only=True)
    
    class Meta:
        model = UserCard
        fields = ['id', 'tea_card', 'quantity']


class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'


class WeeklyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyEvent
        fields = '__all__'