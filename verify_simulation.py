import urllib.request
import urllib.parse
import json

def verify():
    # 1. Login to get token
    url_login = "http://localhost:8000/auth/login"
    data_login = urllib.parse.urlencode({'username': 'TRUE', 'password': 'TALENT'}).encode('utf-8')
    req_login = urllib.request.Request(url_login, data=data_login, headers={'Content-Type': 'application/x-www-form-urlencoded'})

    try:
        with urllib.request.urlopen(req_login) as response:
            result = json.loads(response.read().decode('utf-8'))
            token = result.get("access_token")
            print("Login successful.")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    # 2. Call Summarize Endpoint
    url_summ = "http://localhost:8000/assistant/summarize"
    data_summ = json.dumps({
        "text": "Please summarize this text to verify simulation mode."
    }).encode('utf-8')
    headers_summ = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    req_summ = urllib.request.Request(url_summ, data=data_summ, headers=headers_summ)

    try:
        with urllib.request.urlopen(req_summ) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("\nResponse from server:")
            print(json.dumps(result, indent=2))
            
            summary = result.get("summary", "")
            if "Resumen simulado" in summary:
                print("\n[SUCCESS] Simulation mode is ACTIVE.")
            else:
                print("\n[INFO] Real API mode might be active or unexpected response.")
                
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify()
