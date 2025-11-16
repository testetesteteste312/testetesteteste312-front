"""
Page Object para a página de Login.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC


class LoginPage(BasePage):
    """Page Object para a página de Login."""
    
    # Localizadores
    EMAIL_INPUT = (By.ID, "email")
    PASSWORD_INPUT = (By.ID, "password")
    LOGIN_BUTTON = (By.XPATH, "//button[contains(text(), 'Entrar')]")
    ERROR_MESSAGE = (By.XPATH, "//*[contains(@class, 'destructive')]")
    CADASTRO_LINK = (By.CSS_SELECTOR, 'a[href="/cadastro"]')
    BACK_TO_HOME = (By.XPATH, "//a[contains(text(), 'Voltar')]")
    
    def navigate(self):
        """Navega para a página de login."""
        super().navigate("/login")
    
    def login(self, email, password):
        """Realiza o login."""
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PASSWORD_INPUT, password)
        self.click(self.LOGIN_BUTTON)
    
    def get_error_message(self):
        return self.driver.find_element(By.CSS_SELECTOR, "p.text-destructive").text
    
    def has_error_message(self):
        try:
            self.driver.find_element(By.CSS_SELECTOR, "p.text-destructive")
            return True
        except:
            return False
    
    def click_cadastro_link(self):
        elem = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(self.CADASTRO_LINK)
        )
        self.driver.execute_script("arguments[0].scrollIntoView(true);", elem)
        self.driver.execute_script("arguments[0].click();", elem)
    
    def is_on_login_page(self):
        """Verifica se está na página de login."""
        return "/login" in self.get_current_url()