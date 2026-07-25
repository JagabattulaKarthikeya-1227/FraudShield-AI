import re

with open('frontend/src/pages/SettingsPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'divide-\[\#748092\]/10', 'divide-slate-100'),
    (r'bg-\[\#212A31\](?:/\d+)?', 'bg-slate-900'),
    (r'bg-\[\#2E3944\]/60', 'bg-slate-800/60')
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open('frontend/src/pages/SettingsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
