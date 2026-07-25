import os
import smtplib
from email.message import EmailMessage
from sqlalchemy.orm import Session

def send_email(db: Session, to_email: str, subject: str, body: str) -> bool:
    # Read SMTP configuration securely from environment variables
    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", 587))
    username = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL")
    
    if not host or not username or not password or not from_email:
        print("CRITICAL: SMTP environment variables are not fully configured.")
        return False

    # Construct the message
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email
    msg.set_content(body)

    # Connect to SMTP provider using secure environment credentials
    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_verification_email(db: Session, to_email: str, verify_url: str) -> bool:
    subject = "Verify Your Workspace Account"
    body = f"Welcome!\n\nPlease click the link below to verify your account:\n\n{verify_url}"
    return send_email(db, to_email, subject, body)