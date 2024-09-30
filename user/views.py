import os
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Group
from .serializers import RegisterSerializer, CustomLoginSerializer
from django.core.mail import send_mail
from dotenv import load_dotenv
load_dotenv()


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        if not username.isalnum() and not all(char in '@./+/-/_' for char in username):
            return Response({"error": "Username can only contain letters, digits, and @/./+/-/_ characters"}, status=400)
        if len(username) > 150:
            return Response({"error": "Username must be 150 characters or fewer"}, status=400)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # Print validation errors
            return Response(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_type = request.data.get('user_type')
        one_time_code = request.data.get('one_time_code')

        # Hardcoded one-time code for development
        valid_one_time_code = "1234567890"

        if user_type == 'doctor':
            if one_time_code != valid_one_time_code:
                user.delete()
                return Response({"error": "Invalid one-time code"}, status=400)
            group, created = Group.objects.get_or_create(name='Doctors')
            user.groups.add(group)
        elif user_type == 'patient':
            group, created = Group.objects.get_or_create(name='Patients')
            user.groups.add(group)
        return Response({"user": serializer.data})


class LoginViewSet(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        serializer = CustomLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user_type = serializer.get_user_type(user)
        token = TokenObtainPairSerializer.get_token(user)
        return Response({
            'refresh': str(token),
            'access': str(token.access_token),
            'user_type': user_type
        })


class PasswordResetViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
        if user:
            # Send password reset email
            send_mail(
                'Password Reset Request',
                'Click the link below to reset your password:',
                {EMAIL_HOST_USER},
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset email sent!"})
        return Response({"error": "User not found"}, status=404)


class RefreshViewSet(TokenRefreshView):
    pass


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=205)
        except Exception as e:
            return Response(status=400)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['user_type'] = [group.name for group in user.groups.all()]
        return token
