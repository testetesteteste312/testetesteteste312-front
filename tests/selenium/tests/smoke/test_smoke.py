"""
Testes de Smoke - Verificações rápidas essenciais.
"""

import pytest
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from config.settings import settings


@pytest.mark.smoke
class TestSmoke:
    """Testes de smoke para verificações rápidas."""
    
    def test_aplicacao_carrega(self, driver):
        """Deve carregar a aplicação."""
        driver.get(settings.BASE_URL)
        assert "imunetrack" in driver.title.lower() or \
               "imunetrack" in driver.page_source.lower()
    
    def test_pagina_login_carrega(self, driver):
        """Deve carregar página de login."""
        login_page = LoginPage(driver)
        login_page.navigate()
        
        assert login_page.is_on_login_page()
        assert login_page.is_visible(login_page.EMAIL_INPUT)
    
    def test_fluxo_login_completo(self, driver):
        """Deve completar fluxo de login."""
        login_page = LoginPage(driver)
        login_page.navigate()
        login_page.login(settings.TEST_USER_EMAIL, settings.TEST_USER_PASSWORD)
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_logged_in()
    
    def test_navegacao_principal(self, authenticated_driver):
        """Deve navegar pelas páginas principais."""
        dashboard = DashboardPage(authenticated_driver)
        
        # Testa navegação para agendamento
        dashboard.navigate_to_schedule()
        assert "agendar" in authenticated_driver.current_url.lower() or \
               dashboard.is_visible((By.XPATH, "//*[contains(text(), 'Agendar')]"), timeout=5)
        
        # Volta para dashboard
        dashboard.navigate()
        assert dashboard.is_logged_in()
        
        # Testa navegação para histórico
        dashboard.navigate_to_history()
        assert "history" in authenticated_driver.current_url.lower() or \
               dashboard.is_visible((By.XPATH, "//*[contains(text(), 'Histórico')]"), timeout=5)
