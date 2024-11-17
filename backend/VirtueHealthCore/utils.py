from django.core.mail import send_mail
from django.conf import settings


def send_create_appointment_email(patient_email, doctor_email, appointment_details):
    subject = f"Appointment Confirmation with Dr. {
        appointment_details['doctor_name']}"
    message = (
        f"Dear Patient,\n\n"
        f"Your appointment has been confirmed:\n\n"
        f"Date: {appointment_details['date']}\n"
        f"Time: {appointment_details['time']}\n"
        f"Thank you for choosing our service.\n"
        f"Best regards,\n"
        f"The Virtue Health Team"
    )
    recipient_list = [patient_email, doctor_email]
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL,
              recipient_list, fail_silently=False)
