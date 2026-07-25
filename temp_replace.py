import re

with open('frontend/src/pages/SettingsPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'bg-\[\#D3D9D4\](?:/\d+)?', 'bg-white'),
    (r'text-\[\#2E3944\](?:/\d+)?', 'text-slate-600'),
    (r'text-\[\#212A31\](?:/\d+)?', 'text-slate-900'),
    (r'text-\[\#748092\](?:/\d+)?', 'text-slate-500'),
    (r'bg-\[\#124E66\](?:/\d+)?', 'bg-emerald-600'),
    (r'text-\[\#124E66\](?:/\d+)?', 'text-emerald-600'),
    (r'border-\[\#748092\]/30', 'border-slate-200'),
    (r'border-\[\#748092\]/20', 'border-slate-200'),
    (r'border-\[\#748092\]/10', 'border-slate-100'),
    (r'bg-\[\#748092\]/20', 'bg-slate-50'),
    (r'bg-\[\#748092\]/10', 'bg-slate-100'),
    (r'border-\[\#D3D9D4\]', 'border-white'),
    (r'border-\[\#748092\]/40', 'border-slate-200'),
    (r'bg-\[\#748092\]/40', 'bg-slate-200'),
    (r'ring-\[\#124E66\]', 'ring-emerald-600'),
    (r'border-\[\#124E66\]', 'border-emerald-600'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open('frontend/src/pages/SettingsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
