from datetime import datetime
from django.core.mail import EmailMessage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_email(subject, recipient_list, html_content, plain_content=""):
    """
    Utility function to send emails.
    """
    try:
        email = EmailMessage(
            subject=subject,
            body=plain_content or html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipient_list,
        )
        email.content_subtype = "html"  # Ensure the email is sent as HTML
        email.send()
        logger.info(f"Email sent to: {', '.join(recipient_list)}")
    except Exception as e:
        logger.error(f"Failed to send email to {
                     ', '.join(recipient_list)}: {e}")


def send_appointment_cancel_email(recipient_emails, context):
    """
    Sends an email notification for a canceled appointment.
    """
    subject = "Your Appointment Cancellation"
    html_content = f"""
    <h1>Appointment Cancellation</h1>
    <p>Dear {context['patient_name']},</p>
    <p>Your appointment with Dr. {context['doctor_name']} scheduled for {context['appointment_date']} at {context['appointment_time']} has been canceled.</p>
    """
    send_email(subject, recipient_emails, html_content)


def send_appointment_email(appointment_type, recipient_emails, context):
    """
    Sends appointment-related emails (create, cancel, reschedule).
    """

    # Convert time to 12-hour format with AM/PM
    time_obj = datetime.strptime(
        context["appointment_time"], "%H:%M")  # Input: "15:30"
    context["appointment_time"] = time_obj.strftime(
        "%I:%M %p")  # Output: "03:30 PM"

    if appointment_type == "create":
        subject = "Your Appointment Confirmation"
        html_content = f"""
        <h1>Appointment Confirmation</h1>
        <p>Dear {context['patient_name']},</p>
        <p>Your appointment with Dr. {context['doctor_name']} has been confirmed:</p>
        <ul>
            <li>Date: {context['appointment_date']}</li>
            <li>Time: {context['appointment_time']}</li>
        </ul>
        """
        send_email(subject, recipient_emails, html_content)

    elif appointment_type == "cancel":
        send_appointment_cancel_email(recipient_emails, context)

    elif appointment_type == "reschedule":
        subject = "Your Appointment Rescheduled"
        html_content = f"""
        <h1>Appointment Rescheduled</h1>
        <p>Dear {context['patient_name']},</p>
        <p>Your appointment with Dr. {context['doctor_name']} has been rescheduled:</p>
        <ul>
            <li>New Date: {context['new_appointment_date']}</li>
            <li>Time: {context['new_appointment_time']}</li>
        </ul>
        """
        send_email(subject, recipient_emails, html_content)

    else:
        logger.error(f"Unknown appointment type: {appointment_type}")
