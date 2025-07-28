from django.contrib import admin
from .models import TeaCard, Player, UserCard, Quest, Achievement, WeeklyEvent


@admin.register(TeaCard)
class TeaCardAdmin(admin.ModelAdmin):
    list_display = ['name', 'rarity', 'strength', 'freshness', 'aroma']
    list_filter = ['rarity']
    search_fields = ['name', 'description']


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ['username', 'level', 'experience', 'coins']
    search_fields = ['username']


@admin.register(UserCard)
class UserCardAdmin(admin.ModelAdmin):
    list_display = ['user', 'tea_card', 'quantity']
    list_filter = ['tea_card__rarity']


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'experience_reward', 'coin_reward', 'is_completed']
    list_filter = ['type', 'is_completed']
    search_fields = ['title', 'description']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'category', 'progress', 'is_completed']
    list_filter = ['category', 'is_completed']
    search_fields = ['title', 'description']


@admin.register(WeeklyEvent)
class WeeklyEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'day_of_week', 'start_time', 'end_time', 'reward_type']
    list_filter = ['day_of_week', 'reward_type']
    search_fields = ['title', 'description']