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

    r_slides = requests.get(f"{base_url}/slides/admin", headers={'Authorization': f'Bearer {token}'})
    slides = r_slides.json()
    if not slides: return
    slide_id = slides[0]['id']
    old_status = slides[0]['status']

    print(f"Slide {slide_id} old status: {old_status}")

    r_put = requests.put(f"{base_url}/slides/admin/{slide_id}", 
                         headers={'Authorization': f'Bearer {token}'},
                         json={'status': 'DRAFT' if old_status == 'PUBLISHED' else 'PUBLISHED'})
    
    print("PUT RESPONSE", r_put.status_code, r_put.text)

    r_slides_after = requests.get(f"{base_url}/slides/admin", headers={'Authorization': f'Bearer {token}'})
    new_status = [s for s in r_slides_after.json() if s['id'] == slide_id][0]['status']
    print(f"Slide {slide_id} new status: {new_status}")

if __name__ == '__main__':
    main()
