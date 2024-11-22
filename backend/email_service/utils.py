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


def send_appointment_email_to_patient(context):
    """
    Sends an email to the patient with their appointment details.
    """
    subject = "Your VirtuHealth Appointment Confirmation"
    html_content = f"""
    <h1>VirtuHealth Appointment Confirmation</h1>
    <p>Dear {context['patient_name']},</p>
    <p>Your appointment with Dr. {context['doctor_name']} has been confirmed:</p>
    <ul>
        <li><strong>Reason:</strong> {context['reason']}</li>
        <li><strong>Date:</strong> {context['appointment_date']}</li>
        <li><strong>Time:</strong> {context['appointment_time']}</li>
    </ul>
    """
    send_email(subject, [context['patient_email']], html_content)


def send_appointment_email_to_doctor(context):
    """
    Sends an email to the doctor with details about the patient and appointment.
    """
    subject = "New VirtuHealth Appointment Scheduled"
    html_content = f"""
    <h1>New VirtuHealth Appointment Scheduled</h1>
    <p>Dear Dr. {context['doctor_name']},</p>
    <p>You have a new appointment scheduled:</p>
    <ul>
        <li><strong>Patient Name:</strong> {context['patient_name']}</li>
        <li><strong>Patient Email:</strong> {context['patient_email']}</li>
        <li><strong>Reason:</strong> {context['reason']}</li>
        <li><strong>Date:</strong> {context['appointment_date']}</li>
        <li><strong>Time:</strong> {context['appointment_time']}</li>
    </ul>
    """
    send_email(subject, [context['doctor_email']], html_content)


def send_appointment_cancel_email_to_patient(context):
    """
    Sends an email notification for a canceled appointment to patient.
    """
    # Patient notification
    patient_subject = "Your VirtuHealth Appointment Has Been Canceled"
    patient_html_content = f"""
    <h1>VirtuHealth Appointment Cancellation</h1>
    <p>Dear {context['patient_name']},</p>
    <p>Your appointment with Dr. {context['doctor_name']} scheduled for {context['appointment_date']} at {context['appointment_time']} has been canceled.</p>
    """
    send_email(patient_subject, [
               context['patient_email']], patient_html_content)


def send_appointment_cancel_email_to_doctor(context):
    """
    Sends an email notification for a canceled appointment to doctor.
    """
    # Doctor notification
    doctor_subject = "VirtuHealth Appointment Cancellation Notification"
    doctor_html_content = f"""
    <h1>VirtuHealth Appointment Cancellation</h1>
    <p>Dear Dr. {context['doctor_name']},</p>
    <p>The appointment with {context['patient_name']} scheduled for {context['appointment_date']} at {context['appointment_time']} has been canceled.</p>
    """
    send_email(doctor_subject, [context['doctor_email']], doctor_html_content)


def send_appointment_reschedule_email_to_patient(context):
    """
    Sends an email notification for a rescheduled appointment to patient.
    """
    patient_subject = "Your VirtuHealth Appointment Rescheduled"
    html_content = f"""
    <h1>VirtuHealth Appointment Rescheduled</h1>
    <p>Dear {context['patient_name']},</p>
    <p>Your appointment with Dr. {context['doctor_name']} has been rescheduled:</p>
    <ul>
        <li><strong>New Date:</strong> {context['appointment_date']}</li>
        <li><strong>Time:</strong> {context['appointment_time']}</li>
    </ul>
    """
    send_email(patient_subject, [context['patient_email']], html_content)


def send_appointment_reschedule_email_to_doctor(context):
    """
    Sends an email notification for a rescheduled appointment to doctor.
    """
    doctor_subject = "Your VirtuHealth Appointment Rescheduled"
    html_content = f"""
    <h1>VirtuHealth Appointment Rescheduled</h1>
    <p>Dear Dr. {context['doctor_name']},</p>
    <p>Your appointment with {context['patient_name']} has been rescheduled:</p>
    <ul>
        <li><strong>New Date:</strong> {context['appointment_date']}</li>
        <li><strong>Time:</strong> {context['appointment_time']}</li>
    </ul>
    """
    send_email(doctor_subject, [context['doctor_email']], html_content)


def send_appointment_email(appointment_type, context):
    """
    Sends appointment-related emails (create, cancel, reschedule).
    """
    # Convert time to 12-hour format with AM/PM
    time_obj = datetime.strptime(context["appointment_time"], "%H:%M")
    context["appointment_time"] = time_obj.strftime("%I:%M %p")

    if appointment_type == "create":
        send_appointment_email_to_patient(context)
        send_appointment_email_to_doctor(context)

    elif appointment_type == "cancel":
        send_appointment_cancel_email_to_patient(context)
        send_appointment_cancel_email_to_doctor(context)

    elif appointment_type == "reschedule":
        send_appointment_reschedule_email_to_patient(context)
        send_appointment_reschedule_email_to_doctor(context)
    else:
        logger.error(f"Unknown appointment type: {appointment_type}")
