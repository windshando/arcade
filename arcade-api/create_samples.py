import requests
import json
import os

BASE_URL = "http://localhost:3001/api/v1"
EMAIL = "admin@example.com"
PASSWORD = "ChangeMe123!"

# Images from generate_image
IMAGES = [
    {"path": r"C:\Users\winds\.gemini\antigravity\brain\8fc2d7ea-c65c-4a83-9d2d-9717f9a5267e\hero_fish_game_tech_1777137809358.png", "title": "READY FOR WINNING?", "subtitle": "Discover the most advanced fishing games in the industry.", "layout": "LEFT_TEXT"},
    {"path": r"C:\Users\winds\.gemini\antigravity\brain\8fc2d7ea-c65c-4a83-9d2d-9717f9a5267e\hero_claw_machine_robotics_1777137825316.png", "title": "PRECISION ROBOTICS", "subtitle": "High-quality claw machines engineered for peak performance.", "layout": "RIGHT_TEXT"},
    {"path": r"C:\Users\winds\.gemini\antigravity\brain\8fc2d7ea-c65c-4a83-9d2d-9717f9a5267e\hero_arcade_lounge_futuristic_1777137840953.png", "title": "OWN THE FUTURE", "subtitle": "Build your high-tech arcade floor with our premium solutions.", "layout": "CENTER_BOTTOM"}
]

def main():
    # 1. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
    if resp.status_code != 201 and resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload and Create
    for i, item in enumerate(IMAGES):
        print(f"Processing slide {i+1}...")
        if not os.path.exists(item["path"]):
            print(f"File not found: {item['path']}")
            continue

        # Upload
        with open(item["path"], 'rb') as f:
            files = {'file': f}
            u_resp = requests.post(f"{BASE_URL}/media/admin/upload", headers=headers, files=files)
            if u_resp.status_code != 201:
                print(f"Upload failed for {item['title']}: {u_resp.text}")
                continue
            
            media_id = u_resp.json()["id"]
            print(f"Uploaded {item['title']}, media_id: {media_id}")

            # Create Slide
            slide_data = {
                "status": "PUBLISHED",
                "desktopMediaId": media_id,
                "url": "/products",
                "layoutStyle": item["layout"],
                "buttonStyle": "DARK" if i % 2 == 0 else "LIGHT",
                "sortOrder": i,
                "translations": [
                    {
                        "locale": "EN",
                        "title": item["title"],
                        "subtitle": item["subtitle"],
                        "ctaText": "LEARN MORE"
                    },
                    {
                        "locale": "ZH_CN",
                        "title": f"[ZH] {item['title']}",
                        "subtitle": f"[ZH] {item['subtitle']}",
                        "ctaText": "了解详情"
                    }
                ]
            }
            s_resp = requests.post(f"{BASE_URL}/slides/admin", headers=headers, json=slide_data)
            if s_resp.status_code != 201:
                print(f"Slide creation failed for {item['title']}: {s_resp.text}")
            else:
                print(f"Slide '{item['title']}' created successfully!")

if __name__ == "__main__":
    main()
