"""
Configuração do Selenium + Mock do Backend.
"""

import os
import sys
import pytest
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from config.settings import settings
from dotenv import load_dotenv
import threading
import time
import socket
from flask import Flask, jsonify, request
from flask_cors import CORS

# Carregar variáveis de ambiente
load_dotenv()

# ============================================================================
# MOCK BACKEND
# ============================================================================

app = Flask(__name__)
CORS(app)

# Banco de dados em memória
mock_db = {
    "users": {},
    "vaccines": [
        {"id": 1, "nome": "Hepatite B", "doses": 3},
        {"id": 2, "nome": "BCG", "doses": 1},
        {"id": 3, "nome": "Tríplice Viral (Sarampo, Caxumba, Rubéola)", "doses": 2},
        {"id": 4, "nome": "Febre Amarela", "doses": 1},
        {"id": 5, "nome": "dT (Dupla Adulto)", "doses": 1},
        {"id": 6, "nome": "Influenza (Gripe)", "doses": 1},
    ],
    "historico": {},
    "next_user_id": 1,
    "next_historico_id": 1
}

# Usuário padrão
mock_db["users"][1] = {
    "id": 1,
    "nome": "Usuario Teste",
    "email": "teste@example.com",
    "senha": "senha123",
    "is_admin": False
}

def find_free_port():
    """Encontra uma porta livre."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

@app.route('/usuarios/login', methods=['POST'])
def login():
    email = request.args.get('email')
    senha = request.args.get('senha')
    
    for user in mock_db["users"].values():
        if user["email"] == email and senha == "senha123":
            return jsonify({
                "id": user["id"],
                "nome": user["nome"],
                "email": user["email"],
                "is_admin": user.get("is_admin", False)
            }), 200
    
    return jsonify({"detail": "Email ou senha incorretos"}), 401

@app.route('/usuarios/', methods=['POST'])
def create_user():
    data = request.json
    
    for user in mock_db["users"].values():
        if user["email"] == data["email"]:
            return jsonify({"detail": f"Usuário com email '{data['email']}' já existe"}), 400
    
    user_id = mock_db["next_user_id"]
    mock_db["next_user_id"] += 1
    
    new_user = {
        "id": user_id,
        "nome": data["nome"],
        "email": data["email"],
        "is_admin": False
    }
    mock_db["users"][user_id] = new_user
    
    return jsonify(new_user), 201

@app.route('/usuarios/', methods=['GET'])
def list_users():
    return jsonify([
        {"id": u["id"], "nome": u["nome"], "email": u["email"], "is_admin": u.get("is_admin", False)}
        for u in mock_db["users"].values()
    ]), 200

@app.route('/usuarios/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = mock_db["users"].get(user_id)
    if not user:
        return jsonify({"detail": f"Usuário com ID {user_id} não encontrado"}), 404
    return jsonify({
        "id": user["id"],
        "nome": user["nome"],
        "email": user["email"],
        "is_admin": user.get("is_admin", False)
    }), 200

@app.route('/vacinas/', methods=['GET'])
def list_vaccines():
    return jsonify(mock_db["vaccines"]), 200

@app.route('/vacinas/<int:vaccine_id>', methods=['GET'])
def get_vaccine(vaccine_id):
    vaccine = next((v for v in mock_db["vaccines"] if v["id"] == vaccine_id), None)
    if not vaccine:
        return jsonify({"detail": f"Vacina com ID {vaccine_id} não encontrada"}), 404
    return jsonify(vaccine), 200

@app.route('/usuarios/<int:user_id>/historico/', methods=['GET'])
def list_historico(user_id):
    historico = mock_db["historico"].get(user_id, [])
    return jsonify(historico), 200

@app.route('/usuarios/<int:user_id>/historico/estatisticas', methods=['GET'])
def get_estatisticas(user_id):
    return jsonify({
        "total_doses": 8,
        "doses_aplicadas": 8,
        "doses_pendentes": 2,
        "doses_atrasadas": 0,
        "doses_canceladas": 0,
        "vacinas_completas": 3,
        "vacinas_incompletas": 1,
        "proximas_doses": []
    }), 200

@app.route('/usuarios/<int:user_id>/historico/', methods=['POST'])
def create_historico(user_id):
    data = request.json
    
    historico_id = mock_db["next_historico_id"]
    mock_db["next_historico_id"] += 1
    
    new_registro = {
        "id": historico_id,
        "usuario_id": user_id,
        "vacina_id": data["vacina_id"],
        "vacina_nome": "Hepatite B",
        "numero_dose": data["numero_dose"],
        "status": data.get("status", "pendente"),
        "data_aplicacao": data.get("data_aplicacao"),
        "data_prevista": data.get("data_prevista"),
        "lote": data.get("lote"),
        "local_aplicacao": data.get("local_aplicacao"),
        "profissional": data.get("profissional"),
        "observacoes": data.get("observacoes")
    }
    
    if user_id not in mock_db["historico"]:
        mock_db["historico"][user_id] = []
    
    mock_db["historico"][user_id].append(new_registro)
    
    return jsonify(new_registro), 201

def start_mock_server():
    """Inicia servidor mock."""
    port = int(os.getenv("MOCK_API_PORT", "8000"))
    # Suprimir logs do Flask
    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False, threaded=True)

# ============================================================================
# FIXTURES DO SELENIUM
# ============================================================================

@pytest.fixture(scope="session", autouse=True)
def mock_backend():
    """Inicia mock do backend (uma vez por sessão)."""

    port = find_free_port()
    base_url = f"http://localhost:{port}"
    print(f"\n🚀 Mock backend iniciando em {base_url}...")
    
    def run_server():
        try:
            app.run(host='0.0.0.0', port=port, debug=False, 
                   use_reloader=False, threaded=True)
        except Exception as e:
            print(f"❌ Erro no mock server: {e}")
    
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(2)  # Aguardar inicialização
    
    print(f"✅ Mock backend rodando!")
    
    yield base_url
    
    print("\n🛑 Encerrando mock backend...")


def get_browser_options(browser):
    """Configura opções do browser."""
    headless = os.getenv("HEADLESS", "false").lower() == "true"
    
    if browser == "chrome":
        options = ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-logging")
        options.add_argument("--log-level=3")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        return options
    
    elif browser == "firefox":
        options = FirefoxOptions()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--width=1920")
        options.add_argument("--height=1080")
        return options
    
    else:
        raise ValueError(f"Browser '{browser}' não suportado")


@pytest.fixture
def driver(mock_backend):
    """Fixture do driver do Chrome."""
    options = ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    
    # Usar ChromeDriver do sistema (mais confiável)
    service = ChromeService(executable_path='/usr/bin/chromedriver')
    driver_instance = webdriver.Chrome(service=service, options=options)

    driver_instance.base_url = mock_backend
    
    yield driver_instance
    
    driver_instance.quit()


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para capturar resultado do teste."""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


def take_screenshot(driver, test_name):
    """Captura screenshot em caso de falha."""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        screenshot_dir = "reports/screenshots"
        os.makedirs(screenshot_dir, exist_ok=True)
        
        filename = f"{screenshot_dir}/{test_name}_{timestamp}.png"
        driver.save_screenshot(filename)
        print(f"\\n📸 Screenshot salvo: {filename}")
    except Exception as e:
        print(f"\\n⚠️  Não foi possível capturar screenshot: {e}")


@pytest.fixture
def base_url():
    """URL base do frontend."""
    url = os.getenv("BASE_URL", "http://localhost:3000")
    print(f"\\n🌍 URL base: {url}")
    return url

@pytest.fixture
def authenticated_driver(driver):
    """
    Driver com usuário já autenticado.
    Realiza login automático antes dos testes.
    """
    print("\n🔐 Fazendo login automático...")

    from pages.login_page import LoginPage
    login_page = LoginPage(driver)

    # Como o método navigate() já sabe ir para /login, não precisa de parâmetro
    login_page.navigate()

    # Usa credenciais do .env
    login_page.login(settings.TEST_USER_EMAIL, settings.TEST_USER_PASSWORD)

    # Espera o redirecionamento
    for _ in range(10):
        time.sleep(1)
        try:
            if "dashboard" in driver.current_url.lower() or \
               driver.find_element(By.XPATH, "//*[contains(text(), 'Dashboard')]"):
                print("✅ Login realizado com sucesso!")
                break
        except NoSuchElementException:
            continue
    else:
        print("⚠️ Timeout: não foi possível confirmar login")

    yield driver

    driver.quit()