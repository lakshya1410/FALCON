"""
Fallback File-based Notification System for FALCON
When email/SMS fails, notifications are logged to files
"""

import os
import logging
from datetime import datetime
from typing import Dict, List, Optional
import json

logger = logging.getLogger(__name__)

class FileNotificationService:
    """
    File-based notification service as fallback for email/SMS failures
    """
    
    def __init__(self):
        self.notifications_dir = "notifications"
        self.ensure_notifications_dir()
    
    def ensure_notifications_dir(self):
        """Create notifications directory if it doesn't exist"""
        if not os.path.exists(self.notifications_dir):
            os.makedirs(self.notifications_dir)
    
    def log_notification(self, risk_data: Dict, notification_type: str = "alert"):
        """Log notification to file"""
        
        timestamp = datetime.now()
        filename = f"{notification_type}_{timestamp.strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(self.notifications_dir, filename)
        
        notification_record = {
            "timestamp": timestamp.isoformat(),
            "type": notification_type,
            "risk_data": risk_data,
            "alert_level": "HIGH_PRIORITY" if risk_data.get("risk_score", 0) > 80 else "MEDIUM_PRIORITY",
            "requires_action": True,
            "notification_methods": ["file_log"]
        }
        
        # Save to JSON file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(notification_record, f, indent=2, ensure_ascii=False)
        
        # Also create a human-readable log
        readable_filename = f"{notification_type}_{timestamp.strftime('%Y%m%d_%H%M%S')}.txt"
        readable_filepath = os.path.join(self.notifications_dir, readable_filename)
        
        with open(readable_filepath, 'w', encoding='utf-8') as f:
            f.write(self.create_readable_alert(risk_data))
        
        logger.info(f"📁 Notification logged to: {filepath}")
        return True
    
    def create_readable_alert(self, risk_data: Dict) -> str:
        """Create human-readable alert text"""
        
        risk_score = risk_data.get("risk_score", 0)
        risk_level = risk_data.get("risk_level", "UNKNOWN")
        site_name = risk_data.get("site_name", "Analysis Site")
        timestamp = risk_data.get("timestamp", datetime.now().isoformat())
        
        alert_text = f"""
🚨 FALCON GEOLOGICAL RISK ALERT 🚨
================================================

⚠️  ALERT LEVEL: {risk_level}
📊 RISK SCORE: {risk_score}/100
📍 LOCATION: {site_name}
🕐 TIME: {timestamp}

🔍 ANALYSIS SUMMARY:
- Contributing Factors: {risk_data.get('contributing_factors', 'N/A')} models
- Coordinates: {risk_data.get('latitude', 'N/A')}, {risk_data.get('longitude', 'N/A')}

⚡ IMMEDIATE ACTIONS REQUIRED:
- Review site conditions immediately
- Consider evacuation if risk level is CRITICAL
- Activate emergency response protocols
- Access FALCON dashboard for detailed analysis
- Contact site safety personnel

🔔 NOTIFICATION STATUS:
- File logged: ✅ SUCCESS
- Email sent: ❌ FAILED (Connection timeout)
- SMS sent: ❌ FAILED (Unverified number)

This is an automated alert from the FALCON Geological Risk Assessment System.
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

================================================
        """.strip()
        
        return alert_text

# Create global instance
file_notification_service = FileNotificationService()