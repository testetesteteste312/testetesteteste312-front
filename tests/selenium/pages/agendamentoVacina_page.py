"""
Page Object para a página de Agendamento de Vacinas (compatível com VaccineScheduleForm.tsx)
"""

from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage
from datetime import datetime, timedelta


class VaccineSchedulePage(BasePage):
    """Page Object para agendamento de vacinas."""
    
    # Localizadores baseados no HTML real
    PAGE_TITLE = (By.XPATH, "//h2[contains(., 'Agendar Vacina')]")
    
    VACCINE_SELECT = (By.NAME, "vacina_id")
    DOSE_SELECT = (By.NAME, "numero_dose")
    DATE_INPUT = (By.NAME, "data_prevista")
    LOCATION_INPUT = (By.NAME, "local_aplicacao")
    NOTES_TEXTAREA = (By.NAME, "observacoes")
    
    SUBMIT_BUTTON = (By.XPATH, "//button[contains(., 'Confirmar Agendamento')]")
    SUCCESS_MESSAGE = (By.XPATH, "//*[contains(text(), 'Vacina agendada com sucesso!')]")
    ERROR_MESSAGE = (By.XPATH, "//*[contains(@class, 'text-destructive')]")

    def is_on_schedule_page(self):
        """Verifica se está na página de agendamento."""
        return self.is_visible(self.PAGE_TITLE, timeout=5)

    def select_vaccine(self, vaccine_text):
        """
        Seleciona a vacina procurando por qualquer opção que contenha o texto informado.
        """
        select_element = self.driver.find_element(*self.VACCINE_SELECT)
        select = Select(select_element)

        for option in select.options:
            if vaccine_text.lower() in option.text.lower():
                option.click()
                return

        raise NoSuchElementException(
            f"Vacina contendo '{vaccine_text}' não encontrada. "
            f"Opções disponíveis: {[o.text for o in select.options]}"
        )

    def select_dose(self, dose_number):
        """Seleciona o número da dose."""
        select_element = self.find_element(self.DOSE_SELECT)
        select = Select(select_element)
        select.select_by_value(str(dose_number))

    def set_date(self, date_str):
        """Define a data (formato: YYYY-MM-DD)."""
        self.type_text(self.DATE_INPUT, date_str)

    def set_location(self, location):
        """Define o local."""
        self.type_text(self.LOCATION_INPUT, location)

    def set_notes(self, notes):
        """Define observações."""
        self.type_text(self.NOTES_TEXTAREA, notes)

    def submit(self):
        """Envia o formulário."""
        self.click(self.SUBMIT_BUTTON)

    def schedule_vaccine(self, vaccine, date, location, notes=None):
        """Fluxo completo para agendar vacina."""
        self.select_vaccine(vaccine)
        self.set_date(date)
        self.set_location(location)
        if notes:
            self.set_notes(notes)
        self.submit()

    def has_success_message(self):
        """Verifica se a mensagem de sucesso está visível."""
        return self.is_visible(self.SUCCESS_MESSAGE, timeout=30)

    def has_error_message(self):
        """Verifica se há mensagem de erro exibida."""
        return self.is_visible(self.ERROR_MESSAGE, timeout=5)

    def get_available_vaccines(self):
        """Retorna lista de vacinas disponíveis no select."""
        select_element = self.find_element(self.VACCINE_SELECT)
        select = Select(select_element)
        return [option.text for option in select.options if option.text]
