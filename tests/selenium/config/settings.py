"""Configurações centralizadas para testes."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Carrega variáveis do .env.test
env_path = Path('.') / '.env.test'
load_dotenv(dotenv_path=env_path)


class Settings:
    """Configurações da aplicação de testes."""
    
    # URLs
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    API_URL = os.getenv("API_URL", "http://localhost:8000")
    BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
    
    # Browser
    BROWSER = os.getenv("BROWSER", "chrome").lower()
    HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"
    WINDOW_WIDTH = int(os.getenv("WINDOW_WIDTH", "1920"))
    WINDOW_HEIGHT = int(os.getenv("WINDOW_HEIGHT", "1080"))
    
    # Timeouts
    IMPLICIT_WAIT = int(os.getenv("IMPLICIT_WAIT", "10"))
    EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "20"))
    PAGE_LOAD_TIMEOUT = int(os.getenv("PAGE_LOAD_TIMEOUT", "30"))
    
    # Test User
    TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "admin@teste.com")
    TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD", "admin1")
    TEST_USER_NAME = os.getenv("TEST_USER_NAME", "admin Teste")
    
    # Features
    SCREENSHOT_ON_FAILURE = os.getenv("SCREENSHOT_ON_FAILURE", "true").lower() == "true"
    VIDEO_RECORDING = os.getenv("VIDEO_RECORDING", "false").lower() == "true"
    SLOW_MO = int(os.getenv("SLOW_MO", "0"))
    
    # Debug
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    VERBOSE = os.getenv("VERBOSE", "false").lower() == "true"
    
    # Paths
    BASE_DIR = Path(__file__).resolve().parent.parent
    REPORTS_DIR = Path(__file__).resolve().parent.parent / "reports"
    SCREENSHOTS_DIR = REPORTS_DIR / "screenshots"
    VIDEOS_DIR = REPORTS_DIR / "videos"
    
    @classmethod
    def setup_directories(cls):
        """Cria diretórios necessários."""
        cls.REPORTS_DIR.mkdir(exist_ok=True)
        cls.SCREENSHOTS_DIR.mkdir(exist_ok=True)
        cls.VIDEOS_DIR.mkdir(exist_ok=True)
        if cls.DEBUG:
            print(f"[DEBUG] Diretórios configurados em {cls.REPORTS_DIR}")


settings = Settings()
settings.setup_directories()