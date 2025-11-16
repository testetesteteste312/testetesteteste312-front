"""
Funções auxiliares para os testes automatizados com Selenium.
"""

import os
from datetime import datetime
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def take_screenshot(driver, name: str) -> str:
    """
    Tira um screenshot da tela atual e salva em 'reports/screenshots/' com timestamp.

    Args:
        driver: Instância do WebDriver.
        name (str): Nome base do arquivo de screenshot.

    Returns:
        str: Caminho completo do arquivo de screenshot salvo.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    screenshot_dir = os.path.join("reports", "screenshots")
    os.makedirs(screenshot_dir, exist_ok=True)

    filename = os.path.join(screenshot_dir, f"{name}_{timestamp}.png")
    driver.save_screenshot(filename)
    print(f"\n📸 Screenshot salvo em: {filename}")
    return filename


def wait_for_page_load(driver, timeout: int = 30) -> None:
    """
    Aguarda até que a página esteja completamente carregada (document.readyState == 'complete').

    Args:
        driver: Instância do WebDriver.
        timeout (int): Tempo máximo de espera em segundos.
    """
    WebDriverWait(driver, timeout).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )


def scroll_to_bottom(driver) -> None:
    """
    Faz scroll até o final da página.
    """
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")


def scroll_to_top(driver) -> None:
    """
    Faz scroll até o topo da página.
    """
    driver.execute_script("window.scrollTo(0, 0);")


def get_element_attribute(driver, locator, attribute: str) -> str:
    """
    Retorna o valor de um atributo de um elemento localizado.

    Args:
        driver: Instância do WebDriver.
        locator (tuple): Localizador no formato (By, valor).
        attribute (str): Nome do atributo desejado.

    Returns:
        str: Valor do atributo.
    """
    element = driver.find_element(*locator)
    return element.get_attribute(attribute)


def is_element_present(driver, locator, timeout: int = 5) -> bool:
    """
    Verifica se um elemento está presente na página dentro do tempo especificado.

    Args:
        driver: Instância do WebDriver.
        locator (tuple): Localizador no formato (By, valor).
        timeout (int): Tempo máximo de espera em segundos.

    Returns:
        bool: True se o elemento estiver presente, False caso contrário.
    """
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
        return True
    except Exception:
        return False