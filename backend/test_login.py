import urllib.request
import json

data = json.dumps({"username": "newuser_test"}).encode('utf-8')
req = urllib.request.Request("http://localhost:8000/auth/login", data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("Login response:", result)
        token = result.get("access_token")
        
        # Test /auth/me with the token
        req_me = urllib.request.Request("http://localhost:8000/auth/me", headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req_me) as response_me:
            me_result = json.loads(response_me.read().decode('utf-8'))
            print("Me response:", me_result)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
