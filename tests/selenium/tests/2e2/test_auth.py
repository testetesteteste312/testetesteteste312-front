"""
Testes de Autenticação com Selenium.
"""

import pytest
from pages.login_page import LoginPage
from pages.cadastro_page import CadastroPage
from pages.dashboard_page import DashboardPage
from utils.test_data import generate_random_user
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.settings import settings


class TestAuthentication:
    """Testes de autenticação (login, cadastro, logout e navegação)."""

    def test_login_sucesso(self, driver):
        """Deve fazer login com credenciais válidas."""
        login_page = LoginPage(driver)
        login_page.navigate()

        login_page.login(settings.TEST_USER_EMAIL, settings.TEST_USER_PASSWORD)

        dashboard = DashboardPage(driver)
        assert dashboard.is_logged_in(), "Usuário não foi redirecionado para o dashboard"
        assert "olá" in dashboard.get_welcome_message().lower()

    def test_login_credenciais_invalidas(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate()

        login_page.login("invalido@example.com", "senhaerrada")

        WebDriverWait(driver, 3).until(
            lambda d: "/login" in d.current_url
        )

        assert "/login" in driver.current_url

    def test_login_campos_vazios(self, driver):
        """Deve validar campos obrigatórios."""
        login_page = LoginPage(driver)
        login_page.navigate()

        login_page.click(login_page.LOGIN_BUTTON)

        email_field = driver.find_element(*login_page.EMAIL_INPUT)
        is_valid = driver.execute_script("return arguments[0].checkValidity();", email_field)
        assert not is_valid, "Campo email deveria ser inválido, mas foi aceito."

    def test_cadastro_sucesso(self, driver):
        """Deve criar nova conta com sucesso."""
        user_data = generate_random_user()
        cadastro_page = CadastroPage(driver)
        cadastro_page.navigate()

        cadastro_page.signup(
            name=user_data["name"],
            email=user_data["email"],
            password=user_data["password"],
            confirm_password=user_data["password"]
        )

        assert (
            cadastro_page.has_success_message() or
            "/dashboard" in driver.current_url
        ), "Cadastro não foi concluído com sucesso"

    def test_cadastro_senhas_diferentes(self, driver):
        """Deve validar senhas diferentes."""
        user_data = generate_random_user()
        cadastro_page = CadastroPage(driver)
        cadastro_page.navigate()

        cadastro_page.signup(
            name=user_data["name"],
            email=user_data["email"],
            password="senha123",
            confirm_password="senha456"
        )

        error_msg = cadastro_page.get_error_message().lower()
        assert "não coincidem" in error_msg or "não correspondem" in error_msg

    def test_cadastro_email_invalido(self, driver):
        """Deve validar formato de email."""
        cadastro_page = CadastroPage(driver)
        cadastro_page.navigate()

        cadastro_page.type_text(cadastro_page.NAME_INPUT, "Teste")
        cadastro_page.type_text(cadastro_page.EMAIL_INPUT, "email-invalido")
        cadastro_page.type_text(cadastro_page.PASSWORD_INPUT, "senha123")
        cadastro_page.type_text(cadastro_page.CONFIRM_PASSWORD_INPUT, "senha123")
        cadastro_page.click(cadastro_page.SIGNUP_BUTTON)

        email_field = driver.find_element(*cadastro_page.EMAIL_INPUT)
        is_valid = driver.execute_script("return arguments[0].checkValidity();", email_field)
        assert not is_valid, "Campo email deveria ser inválido."

    def test_navegacao_login_cadastro(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate()

        login_page.click_cadastro_link()

        WebDriverWait(driver, 5).until(
            EC.url_contains("/cadastro")
        )

        assert "/cadastro" in driver.current_url
    
    def test_navegacao_cadastro_login(self, driver):
        cadastro_page = CadastroPage(driver)
        cadastro_page.navigate()

        cadastro_page.click_login_link()

        WebDriverWait(driver, 5).until(
            EC.url_contains("/login")
        )

        assert "/login" in driver.current_url
