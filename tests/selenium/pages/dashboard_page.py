"""
Page Object para o Dashboard.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class DashboardPage(BasePage):
    """Page Object para o Dashboard."""
    
    # Localizadores
    WELCOME_MESSAGE = (By.XPATH, "//h2[contains(text(), 'Olá')]")
    LOGOUT_BUTTON = (By.XPATH, "//button[contains(text(), 'Sair')]")
    USER_NAME = (By.XPATH, "//p[@class='font-medium']")
    USER_EMAIL = (By.XPATH, "//p[@class='text-muted-foreground']")
    
    # Tabs/Menu
    SCHEDULE_TAB = (By.XPATH, "//button[.//span[contains(text(), 'Agendar Vacina')]]")
    HISTORY_TAB = (By.XPATH, "//button[.//span[contains(text(), 'Histórico')]]")
    SETTINGS_BUTTON = (By.XPATH, "//button[contains(text(), 'Configurações')]")
    
    # Cards de Estatísticas
    VACCINES_UP_TO_DATE_CARD = (By.XPATH, "//div[contains(text(), 'Vacinas em Dia')]")
    UPCOMING_VACCINES_CARD = (By.XPATH, "//div[contains(text(), 'Próximas Vacinas')]")
    OVERDUE_VACCINES_CARD = (By.XPATH, "//div[contains(text(), 'Atrasadas')]")
    
    # Valores dos cards
    VACCINES_UP_TO_DATE_VALUE = (By.XPATH, "//div[contains(text(), 'Vacinas em Dia')]/following-sibling::div//div[@class='text-2xl font-bold']")
    UPCOMING_VACCINES_VALUE = (By.XPATH, "//div[contains(text(), 'Próximas Vacinas')]/following-sibling::div//div[@class='text-2xl font-bold']")
    OVERDUE_VACCINES_VALUE = (By.XPATH, "//div[contains(text(), 'Atrasadas')]/following-sibling::div//div[@class='text-2xl font-bold']")
    
    def navigate(self):
        """Navega para o dashboard."""
        super().navigate("/dashboard")
    
    def is_logged_in(self):
        """Verifica se o usuário está logado."""
        return self.is_visible(self.WELCOME_MESSAGE, timeout=10)
    
    def get_welcome_message(self):
        """Obtém mensagem de boas-vindas."""
        return self.get_text(self.WELCOME_MESSAGE)
    
    def logout(self):
        """Realiza logout."""
        self.click(self.LOGOUT_BUTTON)
    
    def navigate_to_schedule(self):
        """Navega para agendamento."""
        self.click(self.SCHEDULE_TAB)
    
    def navigate_to_history(self):
        """Navega para histórico."""
        self.click(self.HISTORY_TAB)
    
    def open_settings(self):
        """Abre configurações."""
        self.click(self.SETTINGS_BUTTON)
    
    def get_vaccines_up_to_date_count(self):
        """Obtém contagem de vacinas em dia."""
        return self.get_text(self.VACCINES_UP_TO_DATE_VALUE)
    
    def get_upcoming_vaccines_count(self):
        """Obtém contagem de próximas vacinas."""
        return self.get_text(self.UPCOMING_VACCINES_VALUE)
    
    def get_overdue_vaccines_count(self):
        """Obtém contagem de vacinas atrasadas."""
        return self.get_text(self.OVERDUE_VACCINES_VALUE)

