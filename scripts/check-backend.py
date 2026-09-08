"""Read-only checks with the project's public key; never print credentials or solutions."""
import json
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config = {}
for line in (ROOT / '.env.local').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        name, value = line.split('=', 1)
        config[name.strip()] = value.strip().strip('"').strip("'")
url = config.get('VITE_SUPABASE_URL', '')
key = config.get('VITE_SUPABASE_PUBLISHABLE_KEY', config.get('VITE_SUPABASE_ANON_KEY', ''))
if not url or not key:
    raise SystemExit('Missing public Supabase configuration')
for label, route in [
    ('public_labs', '/rest/v1/labs?select=id,slug,title&limit=20'),
    ('guided_steps', '/rest/v1/lab_steps?select=id&limit=0'),
    ('legacy_secret_columns', '/rest/v1/labs?select=flag_hash,writeup_markdown&limit=0'),
    ('auth_settings', '/auth/v1/settings'),
]:
    try:
        req = urllib.request.Request(url + route, headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        with urllib.request.urlopen(req, timeout=20) as response:
            data = json.load(response)
            result = {'check': label, 'status': response.status}
            if label == 'public_labs':
                result['labs'] = data
            if label == 'auth_settings':
                result['email_enabled'] = data.get('external', {}).get('email')
                result['autoconfirm'] = data.get('mailer_autoconfirm')
            print(json.dumps(result))
    except urllib.error.HTTPError as error:
        print(json.dumps({'check': label, 'status': error.code, 'code': json.loads(error.read()).get('code')}))
    except urllib.error.URLError as error:
        print(json.dumps({'check': label, 'error': type(error.reason).__name__}))
