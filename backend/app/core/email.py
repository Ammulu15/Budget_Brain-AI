import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_reset_email(to_email: str, reset_link: str):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Reset your BudgetBrain AI password"
    message["From"] = settings.smtp_email
    message["To"] = to_email

    html = f"""
    <div style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #7a1f4d;">Reset your password 🔑</h2>
      <p>We received a request to reset your BudgetBrain AI password. Click below to set a new one:</p>
      <a href="{reset_link}" style="display:inline-block; padding: 12px 24px; background: linear-gradient(to right, #4f8a86, #b0698f); color: white; text-decoration: none; border-radius: 20px;">Reset Password</a>
      <p style="color: #888; font-size: 13px; margin-top: 20px;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
    """
    message.attach(MIMEText(html, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.smtp_email, settings.smtp_password)
        server.sendmail(settings.smtp_email, to_email, message.as_string())