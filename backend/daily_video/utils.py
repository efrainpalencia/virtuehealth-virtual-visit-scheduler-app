from django.core.mail import EmailMessage
from django.conf import settings


def send_virtual_invitation(email, room_url):
    """
    Sends an HTML email invitation for a video call.
    """
    subject = "Your VirtueHealth Visit Invitation"
    html_message = f"""
    <html>
    <body>
        <h1>VirtueHealth Appointment</h1>
        <p>Your scheduled virtual visit is about to begin.</p>
        <p>Join the video call using the link below:</p>
        <a href="{room_url}" style="color: white; background-color: #4CAF50; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Join Video Call</a>
        <p>If you have any issues, please contact us.</p>
        <p>Thank you,<br>The VirtueHealth Team</p>
    </body>
    </html>
    """
    # Create and send the email
    email_message = EmailMessage(
        subject=subject,
        body=html_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    email_message.content_subtype = "html"  # Set content type to HTML
    email_message.send()
