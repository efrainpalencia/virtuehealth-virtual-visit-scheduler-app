import os
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from .utils import send_virtual_invitation
from .daily_utils import create_daily_room
from django.conf import settings
from dotenv import load_dotenv
load_dotenv()

# Load API key from environment variables
DAILY_API_KEY = os.environ.get('DAILY_API_KEY')


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def proxy_create_room(request):
    """
    Proxies the request to the Daily API to bypass CORS and create a video call room.
    """
    url = "https://api.daily.co/v1/rooms"
    headers = {"Authorization": f"Bearer {DAILY_API_KEY}"}

    # Debugging request headers and data
    print("Request headers:", request.headers)
    print("Request data:", request.data)

    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        return Response(response.json(), status=response.status_code)
    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return Response({"error": "Failed to create room.", "details": str(e)}, status=500)


@api_view(["POST"])
def create_room(request):
    """
    API endpoint to create a Daily room using a utility function.
    """
    try:
        room = create_daily_room()
        return Response(room, status=201)
    except Exception as e:
        print("Error:", e)
        return Response({"error": "Failed to create room.", "details": str(e)}, status=500)


@api_view(["POST"])
# Ensure only authenticated doctors can use this
@permission_classes([IsAuthenticated])
def notify_patient(request):
    """
    Sends a video call room URL to the patient's email.
    """
    try:
        email = request.data.get("email")
        room_url = request.data.get("roomUrl")

        # Validate email and room URL
        if not email or not room_url:
            return Response({"error": "Email and roomUrl are required."}, status=400)

        # Send email notification
        send_virtual_invitation(email, room_url)

        return Response({"message": "Invitation sent to the patient."}, status=200)
    except Exception as e:
        print("Error:", e)
        return Response({"error": "Failed to notify patient.", "details": str(e)}, status=500)
