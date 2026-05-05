import requests
import json

base_url = 'http://localhost:3001/api/v1'

def main():
    try:
        with open('login.json', 'r') as f:
            creds = json.load(f)
    except Exception as e:
        print("Creds not found", e)
        return

    r_auth = requests.post(f"{base_url}/auth/login", json=creds)
    token = r_auth.json().get('access_token')

    r_slides = requests.get(f"{base_url}/advantages/admin", headers={'Authorization': f'Bearer {token}'})
    print("GET RESPONSE", r_slides.status_code, r_slides.text)

if __name__ == '__main__':
    main()
