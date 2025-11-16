"""
Testes de Histórico de Vacinas com Selenium.
"""

import pytest
from selenium.webdriver.common.by import By
from pages.dashboard_page import DashboardPage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestVaccineHistory:
    """Testes de histórico de vacinação."""

    def test_acessar_pagina_historico(self, authenticated_driver):
        driver = authenticated_driver

        history_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[.//span[text()='Histórico']]"))
        )
        history_button.click()

        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((
                By.XPATH, "//*[contains(text(), 'Histórico')]"
            ))
        )

    def test_marcar_vacina_pendente(self, authenticated_driver):
        driver = authenticated_driver
        dashboard = DashboardPage(driver)

        # Vai para o histórico
        dashboard.navigate_to_history()

        # Espera que apareça card ou mensagem de vazio
        WebDriverWait(driver, 10).until(
            EC.any_of(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class,'rounded-lg') and .//h4]")),
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Nenhuma vacina')]")),
            )
        )

        # Seleciona cards pendentes (os que NÃO têm 'Aplicada em')
        pending_cards = driver.find_elements(
            By.XPATH,
            "//div[contains(@class,'rounded-lg') and .//p[contains(text(),'Prevista')]]"
        )

        assert pending_cards, "Nenhuma vacina pendente encontrada para testar."

        # Usa o primeiro card pendente
        card = pending_cards[0]

        # Clica no card para abrir o modal
        card.click()

        # Aguarda o modal abrir
        modal = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[@role='dialog']"))
        )

        # Seleciona o checkbox dentro do modal
        checkbox = WebDriverWait(modal, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//input[@id='aplicada']"))
        )
        checkbox.click()

        # Espera o botão Confirmar habilitar
        confirm_button = WebDriverWait(modal, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, ".//button[contains(text(), 'Confirmar') and not(@disabled)]")
            )
        )

        confirm_button.click()

        # Aqui você pode validar que o modal fechou, ou que o status mudou.
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element(modal)
        )