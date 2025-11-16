"""
Testes de Agendamento de Vacinas com Selenium.
"""

import pytest
from datetime import datetime, timedelta
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from pages.dashboard_page import DashboardPage
from pages.agendamentoVacina_page import VaccineSchedulePage


class TestVaccineSchedule:
    """Testes de agendamento de vacinas."""

    def test_acessar_pagina_agendamento(self, authenticated_driver):
        """Deve acessar página de agendamento."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.navigate_to_schedule()

        schedule_page = VaccineSchedulePage(authenticated_driver)
        assert schedule_page.is_on_schedule_page(), "Página de agendamento não foi carregada"

    def test_listar_vacinas_disponiveis(self, authenticated_driver):
        """Deve listar vacinas disponíveis no select."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.navigate_to_schedule()

        schedule_page = VaccineSchedulePage(authenticated_driver)
        vaccines = schedule_page.get_available_vaccines()

        assert len(vaccines) > 0, "Nenhuma vacina disponível"
        assert all(v.strip() for v in vaccines), "Alguma opção de vacina está vazia"

    def test_agendar_vacina_sucesso(self, authenticated_driver):

        driver = authenticated_driver

        dashboard = DashboardPage(driver)
        dashboard.wait_for_page_load()
        dashboard.navigate_to_schedule()

        schedule_page = VaccineSchedulePage(driver)
        schedule_page.wait_for_react_to_load()

        future_date = (datetime.now() + timedelta(days=30)).strftime("%d/%m/%Y")

        schedule_page.schedule_vaccine(
            vaccine="BCG",
            date=future_date,
            location="Clínica Teste",
            notes="Teste de agendamento"
        )

        assert schedule_page.has_success_message(), \
            "Mensagem de sucesso não foi exibida após o agendamento"


    def test_agendar_vacina_sem_observacoes(self, authenticated_driver):
        """Deve agendar vacina sem observações (campo opcional)."""
        dashboard = DashboardPage(authenticated_driver)
        dashboard.navigate_to_schedule()

        schedule_page = VaccineSchedulePage(authenticated_driver)
        schedule_page.wait_for_react_to_load()

        future_date = (datetime.now() + timedelta(days=30)).strftime("%d/%m/%Y")
        
        schedule_page.schedule_vaccine(
            vaccine="BCG",
            date=future_date,
            location="Clínica Teste",
        )

        assert schedule_page.has_success_message(), "Mensagem de sucesso não foi exibida"
