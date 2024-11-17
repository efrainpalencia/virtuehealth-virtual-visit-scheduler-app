from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import send_appointment_email


class AppointmentEmailView(APIView):
    """
    Handles appointment-related email notifications.
    """

    def post(self, request, *args, **kwargs):
        try:
            email_type = request.data.get("type")
            patient_email = request.data.get("patient_email")
            doctor_email = request.data.get("doctor_email")
            context = request.data.get("context")

            if not email_type or not patient_email or not doctor_email or not context:
                return Response({"error": "Missing required data."}, status=status.HTTP_400_BAD_REQUEST)

            recipient_emails = [patient_email, doctor_email]
            send_appointment_email(email_type, recipient_emails, context)
            return Response({"message": "Email sent successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
