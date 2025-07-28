from django.db import models
from django.contrib.auth.models import User


class TeaCard(models.Model):
    """Tea card model matching the existing schema"""
    name = models.CharField(max_length=255)
    description = models.TextField()
    rarity = models.CharField(max_length=50)
    image_url = models.CharField(max_length=500)
    strength = models.IntegerField()
    freshness = models.IntegerField()
    aroma = models.IntegerField()
    abilities = models.JSONField(default=list)  # Array of abilities
    brewing_time = models.CharField(max_length=50)
    brewing_temperature = models.CharField(max_length=50)

    def __str__(self) -> str:
        return str(self.name)

    class Meta:
        db_table = 'tea_cards'


class Player(models.Model):
    """Extended user profile for game data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Will be migrated to Django auth
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)
    coins = models.IntegerField(default=100)

    def __str__(self) -> str:
        return str(self.username)

    class Meta:
        db_table = 'users'


class UserCard(models.Model):
    """Player's card collection"""
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    tea_card = models.ForeignKey(TeaCard, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        db_table = 'user_cards'
        unique_together = ['user', 'tea_card']


class Quest(models.Model):
    """Quest system"""
    QUEST_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('special', 'Special'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=QUEST_TYPES)
    requirement = models.IntegerField()
    experience_reward = models.IntegerField()
    coin_reward = models.IntegerField()
    is_completed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.title)

    class Meta:
        db_table = 'quests'


class Achievement(models.Model):
    """Achievement system"""
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    requirement = models.IntegerField()
    progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    experience_reward = models.IntegerField()
    coin_reward = models.IntegerField()

    def __str__(self) -> str:
        return f"{str(self.user.username)} - {str(self.title)}"

    class Meta:
        db_table = 'achievements'


class WeeklyEvent(models.Model):
    """Weekly events system"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    day_of_week = models.CharField(max_length=20)
    start_time = models.CharField(max_length=10)
    end_time = models.CharField(max_length=10)
    reward_type = models.CharField(max_length=50)
    reward_amount = models.IntegerField()

    def __str__(self) -> str:
        return f"{str(self.day_of_week)}: {str(self.title)}"

    class Meta:
        db_table = 'weekly_events'