import requests

try:
    r = requests.get('http://localhost:3001/api/v1/categories/public?locale=EN')
    print("STATUS", r.status_code)
    print("BODY", r.text)
except Exception as e:
    print(e)
