"""
Waits customizados para Selenium WebDriver.
"""

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.remote.webdriver import WebDriver
from typing import Tuple


class CustomWaits:
    """Coleção de métodos estáticos para waits customizados no Selenium."""

    @staticmethod
    def wait_for_element_to_disappear(driver: WebDriver, locator: Tuple[str, str], timeout: int = 10) -> bool:
        """
        Aguarda até que um elemento desapareça do DOM ou fique invisível.

        Args:
            driver (WebDriver): Instância do Selenium WebDriver.
            locator (tuple): Localizador do elemento no formato (By, valor).
            timeout (int): Tempo máximo de espera em segundos.

        Returns:
            bool: True se o elemento desaparecer antes do timeout, False caso contrário.
        """
        try:
            WebDriverWait(driver, timeout).until(EC.invisibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False

    @staticmethod
    def wait_for_text_in_element(driver: WebDriver, locator: Tuple[str, str], text: str, timeout: int = 10) -> bool:
        """
        Aguarda até que um texto específico esteja presente em um elemento.

        Args:
            driver (WebDriver): Instância do Selenium WebDriver.
            locator (tuple): Localizador do elemento no formato (By, valor).
            text (str): Texto esperado.
            timeout (int): Tempo máximo de espera em segundos.

        Returns:
            bool: True se o texto for encontrado antes do timeout, False caso contrário.
        """
        try:
            WebDriverWait(driver, timeout).until(EC.text_to_be_present_in_element(locator, text))
            return True
        except TimeoutException:
            return False

    @staticmethod
    def wait_for_number_of_windows(driver: WebDriver, num_windows: int, timeout: int = 10) -> bool:
        """
        Aguarda até que o número de janelas abertas seja igual ao especificado.

        Args:
            driver (WebDriver): Instância do Selenium WebDriver.
            num_windows (int): Número esperado de janelas.
            timeout (int): Tempo máximo de espera em segundos.

        Returns:
            bool: True se o número de janelas for atingido antes do timeout, False caso contrário.
        """
        try:
            WebDriverWait(driver, timeout).until(lambda d: len(d.window_handles) == num_windows)
            return True
        except TimeoutException:
            return False