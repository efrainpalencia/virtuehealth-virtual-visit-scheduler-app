from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils import send_appointment_email
import logging

logger = logging.getLogger(__name__)


class AppointmentEmailView(APIView):
    """
    Handles appointment-related email notifications.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            email_type = request.data.get("type")
            context = request.data.get("context")

            if not email_type or not context:
                return Response({"error": "Missing required data."}, status=status.HTTP_400_BAD_REQUEST)

            # Call `send_appointment_email` with the correct arguments
            send_appointment_email(email_type, context)

            return Response({"message": "Emails sent successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
