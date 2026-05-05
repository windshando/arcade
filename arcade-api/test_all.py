import requests

try:
    print("CATEGORIES:", requests.get('http://localhost:3001/api/v1/categories/public?locale=EN').status_code)
    print("SLIDES:", requests.get('http://localhost:3001/api/v1/slides/public?locale=EN').status_code)
    print("ADVANTAGES:", requests.get('http://localhost:3001/api/v1/advantages/public?locale=EN').status_code)
except Exception as e:
    print(e)
