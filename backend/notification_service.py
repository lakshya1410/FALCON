"""
FALCON Notification Service
Handles automated email and SMS notifications for high-risk geological events
"""

import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
from datetime import datetime
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class NotificationService:
    """
    Centralized notification service for FALCON system
    Handles both email and SMS alerts for geological risk events
    """
    
    def __init__(self):
        # SendGrid Configuration
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.sender_email = os.getenv("SENDER_EMAIL", "falcon.risk.alerts@gmail.com")
        
        # Initialize SendGrid client
        if self.sendgrid_api_key:
            self.sendgrid_client = SendGridAPIClient(self.sendgrid_api_key)
        else:
            self.sendgrid_client = None
            logger.warning("SendGrid API key not provided. Email notifications disabled.")
        
        # Twilio Configuration
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        # Initialize Twilio client
        if self.twilio_account_sid and self.twilio_auth_token:
            self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
        else:
            self.twilio_client = None
            logger.warning("Twilio credentials not provided. SMS notifications disabled.")
        
        # Load notification recipients from environment variables
        email_recipients_str = os.getenv("ALERT_EMAIL_RECIPIENTS", "admin@falcon-system.com,safety@falcon-system.com")
        self.default_email_recipients = [email.strip() for email in email_recipients_str.split(",") if email.strip()]
        
        sms_recipients_str = os.getenv("ALERT_SMS_RECIPIENTS", "+1234567890,+0987654321")
        self.default_sms_recipients = [phone.strip() for phone in sms_recipients_str.split(",") if phone.strip()]
        
        # Risk threshold for notifications
        self.risk_threshold = int(os.getenv("RISK_THRESHOLD", "60"))
    
    def create_risk_alert_email(self, risk_data: Dict) -> str:
        """Create HTML email content for risk alert"""
        
        risk_score = risk_data.get("risk_score", 0)
        risk_level = risk_data.get("risk_level", "UNKNOWN")
        site_name = risk_data.get("site_name", "Analysis Site")
        timestamp = risk_data.get("timestamp", datetime.now().isoformat())
        contributing_factors = risk_data.get("contributing_factors", 0)
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .alert-container {{
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #f8f9fa;
                    padding: 20px;
                }}
                .alert-header {{
                    background-color: {'#dc3545' if risk_score >= 75 else '#fd7e14'};
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .alert-body {{
                    background-color: white;
                    padding: 20px;
                    border-radius: 0 0 8px 8px;
                    border: 1px solid #dee2e6;
                }}
                .risk-score {{
                    font-size: 48px;
                    font-weight: bold;
                    color: {'#dc3545' if risk_score >= 75 else '#fd7e14'};
                    text-align: center;
                    margin: 20px 0;
                }}
                .details-table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }}
                .details-table th, .details-table td {{
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }}
                .details-table th {{
                    background-color: #f8f9fa;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    color: #6c757d;
                    font-size: 12px;
                    margin-top: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="alert-container">
                <div class="alert-header">
                    <h1>🚨 GEOLOGICAL RISK ALERT 🚨</h1>
                    <h2>{risk_level} RISK DETECTED</h2>
                </div>
                <div class="alert-body">
                    <div class="risk-score">{risk_score}/100</div>
                    
                    <p><strong>IMMEDIATE ATTENTION REQUIRED</strong></p>
                    <p>The FALCON geological risk assessment system has detected elevated risk conditions that exceed the safety threshold.</p>
                    
                    <table class="details-table">
                        <tr>
                            <th>Site Location</th>
                            <td>{site_name}</td>
                        </tr>
                        <tr>
                            <th>Risk Level</th>
                            <td><strong>{risk_level}</strong></td>
                        </tr>
                        <tr>
                            <th>Risk Score</th>
                            <td><strong>{risk_score}/100</strong></td>
                        </tr>
                        <tr>
                            <th>Contributing Factors</th>
                            <td>{contributing_factors} analysis models</td>
                        </tr>
                        <tr>
                            <th>Detection Time</th>
                            <td>{timestamp}</td>
                        </tr>
                    </table>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <strong>⚠️ Recommended Actions:</strong>
                        <ul>
                            <li>Immediately assess site conditions</li>
                            <li>Consider evacuation if risk level is CRITICAL</li>
                            <li>Activate emergency response protocols</li>
                            <li>Monitor conditions continuously</li>
                            <li>Access FALCON dashboard for detailed analysis</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated alert from the FALCON Geological Risk Assessment System</p>
                    <p>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html_content
    
    def create_risk_alert_sms(self, risk_data: Dict) -> str:
        """Create SMS content for risk alert - optimized for delivery"""
        
        risk_score = risk_data.get("risk_score", 0)
        site_name = risk_data.get("site_name", "Site")
        
        # Professional safety message without spam-triggering words
        sms_content = f"""FALCON Geological Warning

Location: {site_name}
Score: {int(risk_score)} - Elevated conditions detected
Time: {datetime.now().strftime('%H:%M %d/%m')}

SAFETY NOTICE: Move to safe zone away from slopes and unstable areas. Check dashboard for full analysis.
        """.strip()
        
        return sms_content
    
    def send_email_notification(self, risk_data: Dict, recipients: Optional[List[str]] = None) -> bool:
        """Send email notification for high risk alert using SendGrid"""
        
        if not self.sendgrid_client:
            logger.error("SendGrid API key not configured. Cannot send email notifications.")
            return False
        
        recipients = recipients or self.default_email_recipients
        
        try:
            # Create HTML content
            html_content = self.create_risk_alert_email(risk_data)
            
            # Create the email message
            message = Mail(
                from_email=self.sender_email,
                to_emails=recipients,
                subject=f"🚨 FALCON ALERT: {risk_data.get('risk_level', 'HIGH')} Risk Detected - Score {risk_data.get('risk_score', 0)}/100",
                html_content=html_content
            )
            
            # Send email via SendGrid
            response = self.sendgrid_client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"✅ Email alert sent successfully to {len(recipients)} recipients via SendGrid")
                logger.debug(f"SendGrid response: {response.status_code}")
                return True
            else:
                logger.error(f"❌ SendGrid returned error status: {response.status_code}")
                return False
            
        except Exception as e:
            logger.error(f"❌ Failed to send email notification via SendGrid: {str(e)}")
            return False
    
    def send_sms_notification(self, risk_data: Dict, recipients: Optional[List[str]] = None) -> bool:
        """Send SMS notification for high risk alert"""
        
        if not self.twilio_client:
            logger.error("Twilio client not initialized. Cannot send SMS notifications.")
            return False
        
        recipients = recipients or self.default_sms_recipients
        sms_content = self.create_risk_alert_sms(risk_data)
        
        success_count = 0
        
        for phone_number in recipients:
            try:
                message = self.twilio_client.messages.create(
                    body=sms_content,
                    from_=self.twilio_phone_number,
                    to=phone_number
                )
                logger.info(f"✅ SMS sent successfully to {phone_number}: {message.sid}")
                success_count += 1
                
            except Exception as e:
                logger.error(f"❌ Failed to send SMS to {phone_number}: {str(e)}")
        
        return success_count > 0
    
    def send_risk_alert(self, risk_data: Dict, email_recipients: Optional[List[str]] = None, 
                       sms_recipients: Optional[List[str]] = None) -> Dict[str, bool]:
        """
        Send both email and SMS notifications for high risk events
        
        Args:
            risk_data: Dictionary containing risk assessment data
            email_recipients: List of email addresses (optional)
            sms_recipients: List of phone numbers (optional)
            
        Returns:
            Dictionary with success status for each notification type
        """
        
        risk_score = risk_data.get("risk_score", 0)
        
        # Only send notifications if risk score exceeds threshold
        if risk_score <= self.risk_threshold:
            logger.info(f"Risk score {risk_score} is below threshold {self.risk_threshold}. No notifications sent.")
            return {"email": False, "sms": False, "reason": "below_threshold"}
        
        logger.warning(f"🚨 HIGH RISK DETECTED: Score {risk_score}/100 exceeds threshold {self.risk_threshold}")
        
        # Send notifications
        email_success = self.send_email_notification(risk_data, email_recipients)
        sms_success = self.send_sms_notification(risk_data, sms_recipients)
        
        result = {
            "email": email_success,
            "sms": sms_success,
            "risk_score": risk_score,
            "threshold": self.risk_threshold,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Notification results: {result}")
        return result

# Create global instance
notification_service = NotificationService()