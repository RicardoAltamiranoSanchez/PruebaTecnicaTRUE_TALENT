import os
import time
import requests
from playwright.sync_api import sync_playwright

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://frontend:80")
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")

def run_system_rpa(search_term: str):
    result = {"status": "error", "message": "Error desconocido", "data": None}
    steps_log = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context with viewport for better visibility if debugging
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        
        try:
            # 1. Scrape Wikipedia for the term
            steps_log.append(f"Paso 1: Buscando en Wikipedia el término '{search_term}'...")
            print(f"Abriendo Wikipedia para buscar: {search_term}")
            page.goto("https://en.wikipedia.org/wiki/Main_Page")
            page.fill("input[name='search']", search_term)
            page.press("input[name='search']", "Enter")
            
            try:
                # Wait for either article content OR search results
                # .mw-parser-output > p is typical for articles
                # .mw-search-results is typical for search lists
                page.wait_for_selector("#mw-content-text", timeout=5000)
                
                # Check for "Did you mean" suggestion
                if page.locator(".searchdidyoumean a").is_visible():
                     print("Se encontró sugerencia 'Did you mean', haciendo clic...")
                     steps_log.append("Paso 1.1: Corrigiendo búsqueda (Did you mean)...")
                     page.click(".searchdidyoumean a")
                     page.wait_for_selector("#mw-content-text", timeout=5000)

                # Check if we are on a search results page (did not go directly to article)
                if page.locator(".mw-search-results").is_visible():
                    print("Se llegó a la página de resultados de búsqueda. Haciendo clic en el primer resultado...")
                    if page.locator(".mw-search-result-heading a").count() > 0:
                        page.locator(".mw-search-result-heading a").first.click()
                        page.wait_for_selector("#mw-content-text", timeout=5000)
                    else:
                        print("No se encontraron resultados en la lista de búsqueda.")
                        steps_log.append("Paso 1 (Error): No se encontraron resultados en la lista.")

                first_paragraph = page.locator("#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)").first.inner_text()
                print(f"Extraído de Wiki: {first_paragraph[:50]}...")
                steps_log.append(f"Paso 1 (OK): Texto extraído. ({len(first_paragraph)} caracteres)")
            except Exception as e:
                print(f"Fallo al extraer de Wiki: {e}")
                first_paragraph = "No se pudo obtener información de Wikipedia."
                steps_log.append(f"Paso 1 (Fallo): No se pudo extraer info. Error: {str(e)}")

            # 2. Send to Assistant API (Summarize)
            summary_text = first_paragraph
            steps_log.append("Paso 2: Conectando con IA para resumir texto...")
            try:
                # Login to get token
                print("Iniciando sesión en Backend API...")
                auth_resp = requests.post(f"{BACKEND_URL}/auth/login", data={"username": "TRUE", "password": "TALENT"})
                if auth_resp.status_code == 200:
                    token = auth_resp.json()["access_token"]
                    # Call Summarize
                    print("Llamando a /assistant/summarize...")
                    summ_resp = requests.post(
                        f"{BACKEND_URL}/assistant/summarize", 
                        json={"text": first_paragraph},
                        headers={"Authorization": f"Bearer {token}"}
                    )
                    if summ_resp.status_code == 200:
                        summary_text = summ_resp.json()["summary"]
                        steps_log.append("Paso 2 (OK): Resumen generado exitosamente.")
                        print(f"Resumen generado: {summary_text[:50]}...")
                    else:
                        steps_log.append(f"Paso 2 (Error): API devolvió {summ_resp.status_code} - {summ_resp.text}")
                else:
                    steps_log.append(f"Paso 2 (Error): Falló autenticación API ({auth_resp.status_code}).")
            except Exception as e:
                print(f"Fallo al resumir: {e}")
                steps_log.append(f"Paso 2 (Fallo): Error de conexión con API. {str(e)}")


            # 3. Create Result (No Transaction)
            print("Omitiendo creación de transacción según configuración.")
            steps_log.append("Paso 3 (Final): Proceso completado (Solo Resumen).")
            
            result = {
                "status": "success",
                "data": {
                    "wiki_summary": summary_text,
                    "original_text": first_paragraph,
                    "steps": steps_log
                }
            }
            
        except Exception as e:
            print(f"Error del Sistema RPA: {e}")
            steps_log.append(f"Error Fatal: {str(e)}")
            # Capture screenshot on error
            try:
                page.screenshot(path="error_screenshot.png")
            except:
                pass
            result = {"status": "error", "message": str(e), "data": {"steps": steps_log}}
            
        finally:
            browser.close()
            
    return result
