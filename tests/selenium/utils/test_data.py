"""
Módulo utilitário para geração de dados de teste usados nos testes Selenium.
Local: tests/selenium/utils/test_data.py
"""

from faker import Faker
import random
import string
from datetime import datetime, timedelta

fake = Faker("pt_BR")


def generate_random_email() -> str:
    """
    Gera um endereço de e-mail aleatório válido.
    Exemplo: teste_ab12cd34@example.com
    """
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"teste_{random_string}@example.com"


def generate_random_user() -> dict:
    """
    Gera dados de usuário aleatórios (nome, e-mail e senha fixa).
    Retorna:
        dict: {"name": str, "email": str, "password": str}
    """
    return {
        "name": fake.name(),
        "email": generate_random_email(),
        "password": "senha123"
    }


def generate_future_date(days: int = 30) -> str:
    """
    Gera uma data futura formatada (YYYY-MM-DD).
    Args:
        days (int): Número de dias a partir da data atual.
    Retorna:
        str: Data futura no formato ISO (YYYY-MM-DD).
    """
    return (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")


# ------------------------------
# Dados pré-definidos
# ------------------------------

VALID_VACCINES = [
    "Hepatite B",
    "Tríplice Viral (Sarampo, Caxumba, Rubéola)",
    "Febre Amarela",
    "dT (Dupla Adulto)",
    "Influenza (Gripe)",
]

INVALID_EMAILS = [
    "email_sem_arroba",
    "@semdominio.com",
    "usuario@",
    "usuario @dominio.com",
    "",
]

INVALID_PASSWORDS = [
    "",
    "12345",
    "abc",
    "a",
    "12",
]
