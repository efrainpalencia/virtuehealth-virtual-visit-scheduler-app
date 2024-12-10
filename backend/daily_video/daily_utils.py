import os
import requests
from dotenv import load_dotenv
load_dotenv()

DAILY_API_KEY = os.environ.get('DAILY_API_KEY')


def create_daily_room():
    """
    Creates a new Daily room using the Daily REST API.
    Returns the room URL and ID.
    """
    url = "https://api.daily.co/v1/rooms"
    headers = {"Authorization": f"Bearer {DAILY_API_KEY}"}
    payload = {
        "properties": {
            "enable_screenshare": True,
            "enable_chat": True,
            "start_video_off": True,
            "start_audio_off": True,
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()
