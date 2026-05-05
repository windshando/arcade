import requests

try:
    r = requests.get('http://localhost:3000/en')
    if r.status_code == 500:
        print("Frontend is throwing a 500.")
        if "API request failed with status" in r.text:
            print("The API is specifically what's failing inside Next.")
        else:
            print(r.text)
    else:
        print("Frontend returned 200 OK")
except Exception as e:
    print(e)
