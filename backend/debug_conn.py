import urllib.request
import urllib.error
import socket

def test_url(url, name):
    print(f"--- Testing {name} ({url}) ---")
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            print(f"✅ Success! Status: {response.status}")
            return True
    except urllib.error.URLError as e:
        print(f"❌ Failed: {e.reason}")
        return False
    except socket.timeout:
        print(f"❌ Timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

print("diagnosing network...")
test_url("https://www.google.com", "Google")
test_url("https://huggingface.co", "Hugging Face Web")
test_url("https://api-inference.huggingface.co", "Hugging Face API")
