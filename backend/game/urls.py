from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeaCardViewSet, PlayerViewSet, UserCardViewSet,
    QuestViewSet, AchievementViewSet, WeeklyEventViewSet
)

router = DefaultRouter()
router.register(r'tea-cards', TeaCardViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'user-cards', UserCardViewSet)
router.register(r'quests', QuestViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'weekly-events', WeeklyEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Legacy API endpoints for compatibility
    path('user/', PlayerViewSet.as_view({'get': 'current'}), name='current-user'),
]