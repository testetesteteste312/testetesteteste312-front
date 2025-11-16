"""Classe base para todos os Page Objects."""

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    StaleElementReferenceException
)
from config.settings import settings


class BasePage:
    """Classe base para Page Objects."""
    
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, settings.EXPLICIT_WAIT)
        self.actions = ActionChains(driver)
    
    def navigate(self, path=""):
        """Navega para uma URL."""
        url = f"{settings.FRONTEND_URL}{path}"
        self.driver.get(url)
        self.wait_for_page_load()
    
    def wait_for_page_load(self):
        """Aguarda página carregar completamente."""
        self.wait.until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
    
    def find_element(self, locator, timeout=None):
        """Encontra elemento com espera."""
        wait_time = timeout or settings.EXPLICIT_WAIT
        wait = WebDriverWait(self.driver, wait_time)
        return wait.until(EC.presence_of_element_located(locator))
    
    def find_elements(self, locator, timeout=None):
        """Encontra múltiplos elementos."""
        wait_time = timeout or settings.EXPLICIT_WAIT
        wait = WebDriverWait(self.driver, wait_time)
        return wait.until(EC.presence_of_all_elements_located(locator))
    
    def click(self, locator, timeout=None):
        """Clica em elemento."""
        wait_time = timeout or settings.EXPLICIT_WAIT
        wait = WebDriverWait(self.driver, wait_time)
        element = wait.until(EC.element_to_be_clickable(locator))
        
        self.scroll_to_element(locator)
        
        try:
            element.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", element)
    
    def type_text(self, locator, text, clear_first=True):
        """Digita texto em campo."""
        element = self.find_element(locator)
        
        if clear_first:
            element.clear()
        
        element.send_keys(text)
    
    def get_text(self, locator):
        """Obtém texto de elemento."""
        element = self.find_element(locator)
        return element.text
    
    def get_attribute(self, locator, attribute):
        """Obtém atributo de elemento."""
        element = self.find_element(locator)
        return element.get_attribute(attribute)
    
    def is_visible(self, locator, timeout=5):
        """Verifica se elemento está visível."""
        try:
            wait = WebDriverWait(self.driver, timeout)
            wait.until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False
    
    def is_present(self, locator, timeout=5):
        """Verifica se elemento está presente no DOM."""
        try:
            wait = WebDriverWait(self.driver, timeout)
            wait.until(EC.presence_of_element_located(locator))
            return True
        except TimeoutException:
            return False
    
    def wait_for_url_contains(self, text, timeout=None):
        """Espera URL conter texto."""
        wait_time = timeout or settings.EXPLICIT_WAIT
        wait = WebDriverWait(self.driver, wait_time)
        wait.until(EC.url_contains(text))
    
    def wait_for_element_to_disappear(self, locator, timeout=None):
        """Espera elemento desaparecer."""
        wait_time = timeout or settings.EXPLICIT_WAIT
        wait = WebDriverWait(self.driver, wait_time)
        wait.until(EC.invisibility_of_element_located(locator))
    
    def scroll_to_element(self, locator):
        """Scroll até elemento."""
        element = self.find_element(locator)
        self.driver.execute_script(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});",
            element
        )
    
    def scroll_to_top(self):
        """Scroll para topo da página."""
        self.driver.execute_script("window.scrollTo(0, 0);")
    
    def scroll_to_bottom(self):
        """Scroll para fim da página."""
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    
    def get_current_url(self):
        """Retorna URL atual."""
        return self.driver.current_url
    
    def refresh(self):
        """Atualiza página."""
        self.driver.refresh()
        self.wait_for_page_load()
    
    def go_back(self):
        """Volta para página anterior."""
        self.driver.back()
        self.wait_for_page_load()
    
    def execute_script(self, script, *args):
        """Executa JavaScript."""
        return self.driver.execute_script(script, *args)
    
    def hover_over(self, locator):
        """Passa mouse sobre elemento."""
        element = self.find_element(locator)
        self.actions.move_to_element(element).perform()
    
    def press_key(self, locator, key):
        """Pressiona tecla em elemento."""
        element = self.find_element(locator)
        element.send_keys(key)
    
    def wait_for_react_to_load(self, timeout=10):
        """
        Espera React carregar completamente.
        Verifica se há loading spinners ou hydration.
        """
        wait = WebDriverWait(self.driver, timeout)
        
        # Aguarda loading spinner desaparecer (se houver)
        loading_spinner = (By.CSS_SELECTOR, "[data-loading='true'], .loading-spinner")
        try:
            wait.until(EC.invisibility_of_element_located(loading_spinner))
        except:
            pass
        
        # Aguarda React hidratar
        wait.until(
            lambda d: d.execute_script(
                "return document.readyState === 'complete' && "
                "(!window.React || !window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)"
            )
        )
