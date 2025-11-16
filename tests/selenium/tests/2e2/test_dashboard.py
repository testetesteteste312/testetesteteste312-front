"""
Testes do Dashboard com Selenium.
"""

import pytest
from selenium.webdriver.common.by import By
from pages.dashboard_page import DashboardPage
from pages.agendamentoVacina_page import VaccineSchedulePage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.settings import settings
import time

class TestDashboard:
    """Testes do Dashboard."""

    def test_visualizar_dashboard(self, authenticated_driver):
        """Deve exibir o dashboard corretamente."""
        dashboard = DashboardPage(authenticated_driver)

        assert dashboard.is_logged_in(), "Usuário não está autenticado"
        assert "olá" in dashboard.get_welcome_message().lower(), "Mensagem de boas-vindas não encontrada"

    def test_navegar_para_agendamento(self, authenticated_driver):
        """Deve navegar para página de agendamento."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.navigate_to_schedule()

        schedule_page = VaccineSchedulePage(authenticated_driver)
        assert schedule_page.is_on_schedule_page(), "Não foi redirecionado para a página de agendamento"

    def test_navegar_para_historico(self, authenticated_driver):
        """Deve navegar para página de histórico."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.navigate_to_history()

        assert (
            "history" in authenticated_driver.current_url.lower()
            or dashboard.is_visible((By.XPATH, "//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'histórico')]"))
        ), "Não navegou para a página de histórico"

    def test_abrir_configuracoes(self, authenticated_driver):
        """Deve abrir modal de configurações."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.open_settings()

        settings_modal = (By.XPATH, "//*[contains(text(), 'Configurações')]")
        assert dashboard.is_visible(settings_modal, timeout=5), "Modal de configurações não foi exibido"

    def test_informacoes_usuario_visiveis(self, authenticated_driver):
        """Deve exibir informações do usuário."""
        dashboard = DashboardPage(authenticated_driver)

        assert dashboard.is_visible(dashboard.USER_NAME, timeout=3), "Nome do usuário não está visível"
        assert dashboard.is_visible(dashboard.USER_EMAIL, timeout=3), "Email do usuário não está visível"

    def test_abrir_card_do_calendario(self, authenticated_driver):
        driver = authenticated_driver
        dashboard = DashboardPage(driver)

        dashboard.navigate()

        dia = "12"

        dia_elemento = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((
                By.XPATH,
                f"//div[contains(@class, 'aspect-square') and contains(@class, 'cursor-pointer') and normalize-space(text())='{dia}']"
            ))
        )
        dia_elemento.click()

        time.sleep(2)

        card_aberto = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((
                By.XPATH,
                "//div[contains(@class, 'rounded-lg') and contains(@class, 'border') and .//h4]"
            ))
        )

        assert card_aberto is not None