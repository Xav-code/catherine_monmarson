"""
Crops the relevant region out of each deployment screenshot.

Full-screen captures embed badly in a document: the detail that matters is a
small panel inside 1,260 pixels of browser chrome and desktop. These crops are
what go into the Word guide; the originals stay alongside for context.

Run: python scripts/make-crops.py
Output: docs/deployment-snapshots/crops/
"""
from PIL import Image
import os

SRC = 'docs/deployment-snapshots'
OUT = os.path.join(SRC, 'crops')
os.makedirs(OUT, exist_ok=True)

# name -> (left, top, right, bottom) as fractions of width/height, so the
# numbers survive the few-pixel differences between captures.
REGIONS = {
    # Browser panels: drop the OS chrome, keep the content column.
    '01-panel-home':               (0.00, 0.05, 1.00, 0.72),
    '02-manage-websites':          (0.17, 0.13, 1.00, 0.68),
    '03-servers-and-usage':        (0.17, 0.13, 1.00, 0.50),
    '04-sftp-users':               (0.17, 0.13, 1.00, 0.70),
    '05-ssh-toggle-error':         (0.17, 0.33, 1.00, 0.85),
    '06-updating-user-permissions': (0.17, 0.38, 1.00, 0.58),
    '07-ssh-enabled':              (0.17, 0.36, 1.00, 0.87),
    '08-reset-password-redacted':  (0.17, 0.42, 1.00, 0.78),
    # Terminals: keep only the lines, not the empty black field below.
    '09-powershell-split-command': (0.00, 0.00, 1.00, 0.78),
    '10-connection-reset':         (0.00, 0.44, 1.00, 0.78),
    '11-password-not-propagated':  (0.00, 0.52, 1.00, 0.82),
    '12-ssh-login-success':        (0.00, 0.50, 1.00, 0.98),
    '13-scp-in-progress':          (0.00, 0.02, 1.00, 0.28),
    '14-scp-complete':             (0.00, 0.02, 1.00, 0.30),
    # The broken-site symptom: the top of the page says it all.
    '00-symptom-unstyled-site':    (0.00, 0.05, 1.00, 0.62),
}

for name, (l, t, r, b) in REGIONS.items():
    path = os.path.join(SRC, name + '.png')
    if not os.path.exists(path):
        print('  missing ' + name)
        continue
    im = Image.open(path)
    w, h = im.size
    box = (int(w * l), int(h * t), int(w * r), int(h * b))
    crop = im.crop(box)
    # Upscale narrow crops a little so text stays legible once Word shrinks
    # them to the text column.
    if crop.width < 900:
        f = 900 / crop.width
        crop = crop.resize((int(crop.width * f), int(crop.height * f)), Image.LANCZOS)
    crop.save(os.path.join(OUT, name + '.png'), optimize=True)
    print(f'  {name:32} {box[2]-box[0]}x{box[3]-box[1]}')

print(f'\n  {len(os.listdir(OUT))} crops in {OUT}')
