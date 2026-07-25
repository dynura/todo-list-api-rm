import smtplib
from email.message import EmailMessage
from sqlalchemy.orm import Session
from .models import SMTPConfig

def send_email(db: Session, to_email: str, subject: str, body: str) -> bool:
    # 1. Retrieve the active SMTP configuration from tasks.db
    config = db.query(SMTPConfig).filter(SMTPConfig.is_active == True).first()
    
    if not config:
        print("CRITICAL: No active SMTP configuration found in the database.")
        return False

    # 2. Construct the message
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = config.from_email
    msg['To'] = to_email
    msg.set_content(body)

    # 3. Connect to Brevo using credentials stored in DB
    try:
        with smtplib.SMTP(config.host, config.port) as server:
            server.starttls()
            server.login(config.username, config.password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Failed to send email via Brevo: {e}")
        return False

def send_verification_email(db: Session, to_email: str, verify_url: str) -> bool:
    subject = "Verify Your Workspace Account"
    body = f"Welcome!\n\nPlease click the link below to verify your account:\n\n{verify_url}"
    return send_email(db, to_email, subject, body)