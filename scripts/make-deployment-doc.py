"""
Generates the deployment guide as a Word document, with the screenshots.

Mirrors docs/DEPLOYMENT.md. Run scripts/make-crops.py first if the crops are
missing — this script uses them in preference to the full-screen originals.

Run: python scripts/make-deployment-doc.py
Output: Catherine-Monmarson-deployment-guide.docx (repo root)
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.table import WD_TABLE_ALIGNMENT
from datetime import date
import os

INK = RGBColor(0x1A, 0x1A, 0x1A)
MUTED = RGBColor(0x5E, 0x64, 0x5F)
ACCENT = RGBColor(0x3F, 0x65, 0x54)
WARN = RGBColor(0x8A, 0x6A, 0x2F)
CODE_INK = RGBColor(0x1F, 0x2D, 0x27)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'docs', 'deployment-snapshots')
CROPS = os.path.join(SHOTS, 'crops')
TEXT_WIDTH_CM = 16.0

doc = Document()

# ---------------------------------------------------------------- styles ---

normal = doc.styles['Normal']
normal.font.name = 'Calibri'
normal.font.size = Pt(10.5)
normal.font.color.rgb = INK
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.15
normal.element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')

for name, size, colour, before, after in [
    ('Heading 1', 18, INK, 20, 8),
    ('Heading 2', 14, ACCENT, 18, 6),
    ('Heading 3', 11, INK, 12, 4),
]:
    st = doc.styles[name]
    st.font.name = 'Calibri'
    st.font.size = Pt(size)
    st.font.color.rgb = colour
    st.font.bold = name != 'Heading 1'
    st.paragraph_format.space_before = Pt(before)
    st.paragraph_format.space_after = Pt(after)
    st.paragraph_format.keep_with_next = True

for section in doc.sections:
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)


def para(text='', style=None, bold=False, colour=None, size=None,
         space_after=None, italic=False):
    p = doc.add_paragraph(style=style)
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    if colour is not None:
        r.font.color.rgb = colour
    if size is not None:
        r.font.size = Pt(size)
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    return p


def rich(parts, space_after=None):
    p = doc.add_paragraph()
    for text, fmt in parts:
        r = p.add_run(text)
        r.bold = fmt.get('bold', False)
        r.italic = fmt.get('italic', False)
        if fmt.get('mono'):
            r.font.name = 'Consolas'
            r.font.size = Pt(9.5)
        if 'colour' in fmt:
            r.font.color.rgb = fmt['colour']
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    return p


def bullet(text):
    p = doc.add_paragraph(text, style='List Bullet')
    p.paragraph_format.left_indent = Cm(0.7)
    p.paragraph_format.space_after = Pt(3)
    return p


def numbered(text):
    p = doc.add_paragraph(text, style='List Number')
    p.paragraph_format.left_indent = Cm(0.8)
    p.paragraph_format.space_after = Pt(3)
    return p


def shade_para(p, hex_colour):
    el = OxmlElement('w:shd')
    el.set(qn('w:val'), 'clear')
    el.set(qn('w:fill'), hex_colour)
    p._p.get_or_add_pPr().append(el)


def code(lines, label=None):
    """A shaded monospace block. `lines` is a string or list of strings."""
    if isinstance(lines, str):
        lines = [lines]
    if label:
        para(label, size=8.5, colour=MUTED, space_after=2)
    p = doc.add_paragraph()
    for i, line in enumerate(lines):
        if i:
            p.add_run().add_break()
        r = p.add_run(line)
        r.font.name = 'Consolas'
        r.font.size = Pt(9)
        r.font.color.rgb = CODE_INK
    pf = p.paragraph_format
    pf.left_indent = Cm(0.4)
    pf.right_indent = Cm(0.2)
    pf.space_before = Pt(5)
    pf.space_after = Pt(9)
    pf.line_spacing = 1.1
    shade_para(p, 'EDEEEA')
    return p


def note(parts, colour=ACCENT):
    p = doc.add_paragraph()
    for text, fmt in parts:
        r = p.add_run(text)
        r.bold = fmt.get('bold', False)
        r.italic = fmt.get('italic', False)
        if fmt.get('mono'):
            r.font.name = 'Consolas'
            r.font.size = Pt(9.5)
        r.font.color.rgb = fmt.get('colour', colour)
    pf = p.paragraph_format
    pf.left_indent = Cm(0.4)
    pf.space_before = Pt(6)
    pf.space_after = Pt(10)
    return p


def shot(name, caption, width_cm=TEXT_WIDTH_CM):
    """Insert the cropped extract if present, else the full screenshot."""
    path = os.path.join(CROPS, name + '.png')
    if not os.path.exists(path):
        path = os.path.join(SHOTS, name + '.png')
    if not os.path.exists(path):
        para(f'[missing screenshot: {name}]', colour=WARN)
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    p.add_run().add_picture(path, width=Cm(width_cm))
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = c.add_run(caption)
    r.font.size = Pt(8.5)
    r.font.color.rgb = MUTED
    r.italic = True
    c.paragraph_format.space_after = Pt(12)


def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ''
        r = hdr[i].paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        hdr[i].paragraphs[0].paragraph_format.space_after = Pt(2)
        shade_para(hdr[i].paragraphs[0], 'EDEEEA')
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ''
            r = cells[i].paragraphs[0].add_run(str(v))
            r.font.size = Pt(9.5)
            cells[i].paragraphs[0].paragraph_format.space_after = Pt(2)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def page_break():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


# ----------------------------------------------------------------- cover ---

para('Deploying to DreamHost over SSH', style='Heading 1')
rich([('Catherine Monmarson — catherinemonmarson.seailles.com', {'colour': MUTED})],
     space_after=2)
rich([(f'Prepared for Xavier Faguer · {date.today().strftime("%d %B %Y")}',
       {'colour': MUTED})], space_after=12)

para(
    'A complete walkthrough of publishing the site, with the screenshots from the first '
    'successful deployment on 3 November 2026. Follow it top to bottom the first time. Once '
    'SSH is set up, a routine deployment is only sections 6 to 8 — about five minutes.'
)

note([
    ('A note on the password. ', {'bold': True}),
    ('The password is deliberately not written in this document, and it is blanked out in the '
     'screenshot in section 4. A password that grants shell access and full write access to '
     'the live site belongs in a password manager, not in a document that gets shared or '
     'committed to a repository. If a password has ever appeared in a screenshot, reset it.',
     {}),
])

para('What you need', style='Heading 2')
table(
    ['', ''],
    [
        ['A DreamHost account', 'with seailles.com hosted on it'],
        ['Windows 10 or 11', 'ssh and scp are built in — nothing to install'],
        ['Node.js 22 or newer', 'only on the machine that builds the site'],
        ['About 30 minutes', 'the first time; five minutes thereafter'],
    ],
    widths=[5.0, 11.0],
)
para(
    'You never need FileZilla, WinSCP, or the panel\u2019s File Manager. Section 11 explains '
    'why the File Manager in particular must be avoided.'
)

# ------------------------------------------------------------------ §2 ---

page_break()
para('1. Find your account details', style='Heading 2')
para('Sign in at panel.dreamhost.com. The left sidebar is your map.')
shot('01-panel-home', 'The DreamHost panel. Everything needed is under Websites and Servers & Usage.')

para(
    'Open Websites \u2192 Manage Websites. This confirms which server the site is on and which '
    'PHP version it runs \u2014 PHP matters later, when the contact form is switched on.'
)
shot('02-manage-websites', 'Manage Websites: the server and PHP version for each domain.')

table(
    ['Detail', 'Value'],
    [
        ['Domain', 'catherinemonmarson.seailles.com'],
        ['Plan', 'Web Hosting Growth'],
        ['Server', 'sin1-shared-02 (Singapore)'],
        ['PHP', '8.3'],
        ['Web server', 'Apache'],
    ],
    widths=[4.5, 11.5],
)

para(
    'Servers & Usage shows the same server from the hardware side, and carries the Manage SSH '
    'Keys link used in section 12.'
)
shot('03-servers-and-usage', 'Servers & Usage, with the Manage SSH Keys link at the top right.')

# ------------------------------------------------------------------ §3 ---

page_break()
para('2. Enable SSH', style='Heading 2')
para('Go to Websites \u2192 SFTP Users & Files. Each site has its own user.')
shot('04-sftp-users', 'SFTP Users. The user dh_t7jqdj owns catherinemonmarson.seailles.com.')

note([
    ('The \u22ee menu on the right is the wrong place. ', {'bold': True}),
    ('It only offers \u201cAllow insecure connections (FTP)\u201d and \u201cDelete User\u201d. '
     'The SSH switch is behind the Login Info button.', {}),
], colour=WARN)

para('Click Login Info on that row. The panel expands to show the connection details and a '
     'Secure Shell Access (SSH) toggle.')
shot('05-ssh-toggle-error',
     'Login Info expanded. Note the error message: the change often applies anyway.')

para('Record these \u2014 you will need all three:')
code([
    'Host      sin1-shared-02.dreamhost.com',
    'Username  dh_t7jqdj',
    'Port      22',
    'Path      /home/dh_t7jqdj',
])

para('Now flick the Secure Shell Access (SSH) toggle on the right.')
note([
    ('If you see \u201cSorry, there was a problem. Please try again!\u201d ', {'bold': True}),
    ('\u2014 as in the screenshot above \u2014 the change has often been applied regardless. '
     'Reload the page before concluding it failed.', {}),
], colour=WARN)

para(
    'Watch the row. A progress bar reading \u201cUpdating user permissions\u2026\u201d means it '
    'is working. This is the propagation step, and it is why connecting too early fails.'
)
shot('06-updating-user-permissions',
     'The propagation step. Connecting before this finishes gives a connection reset.')

para(
    'Wait until the toggle turns blue and a Shell Type dropdown appears showing /bin/bash. That '
    'is the confirmation that SSH is live. Allow about ten minutes from toggling to the server '
    'actually accepting logins.'
)
shot('07-ssh-enabled',
     'SSH enabled: the toggle is blue, Shell Type is /bin/bash, and the heading now reads SFTP/SSH.')

# ------------------------------------------------------------------ §4 ---

page_break()
para('3. Set the password', style='Heading 2')
para('On the same expanded row, click Change password.')
shot('08-reset-password-redacted',
     'The password panel. The value is blanked here deliberately \u2014 see the note on the first page.')

numbered('Click Generate strong password, or type one of your own.')
numbered('Click Reset Password.')
numbered('Save it in your password manager immediately \u2014 the panel will not show it again.')
numbered('Wait ten minutes before using it.')

note([
    ('That last point matters. ', {'bold': True}),
    ('A password change propagates on the same delay as the SSH toggle. Using it too soon gives '
     '\u201cConnection closed by \u2026 port 22\u201d, which looks like a wrong password but is '
     'not. See section 10.', {}),
])

# ------------------------------------------------------------------ §5 ---

para('4. Allow SSH through McAfee', style='Heading 2')
para(
    'On a machine running McAfee, SSH fails before you are even asked for a password. The '
    'symptom is distinctive: the connection is reset immediately, and it happens for every host, '
    'not just DreamHost.'
)
para('To confirm it is the firewall rather than DreamHost:')
code('ssh git@github.com', label='PowerShell')
para('If that is also reset, the problem is local. The fix is to grant both programs access in '
     'McAfee \u2192 Firewall \u2192 the app-permissions list:')
code([
    r'C:\Windows\System32\OpenSSH\ssh.exe',
    r'C:\Windows\System32\OpenSSH\scp.exe',
])
para(
    'Turning the firewall off temporarily also works for a one-off deployment, but the '
    'permission entries are worth adding \u2014 the same block breaks git push over SSH and '
    'every other SSH tool.'
)

# ------------------------------------------------------------------ §6 ---

page_break()
para('5. Build the site', style='Heading 2')
para('On the machine with the repository:')
code([
    'cd C:\\Users\\Xavier\\Documents\\Github\\catherine_monmarson',
    'npm run build',
], label='PowerShell')
para(
    'This generates the dist folder \u2014 around 1,850 files and 122 MB. It also writes '
    '.htaccess, robots.txt and, when the contact form is enabled, contact.php.'
)

note([
    ('Package it with the script below, ', {'bold': True}),
    ('not with Windows\u2019 \u201cSend to \u2192 Compressed folder\u201d and not with '
     'PowerShell\u2019s Compress-Archive. Both write ZIP entries containing backslashes, which '
     'Linux unzip treats as literal filenames \u2014 flattening the whole site into one '
     'directory.', {}),
], colour=WARN)

code([
    'python - <<\'PY\'',
    'import zipfile, os',
    'with zipfile.ZipFile(os.path.join(\'..\',\'catherinemonmarson-site.zip\'),\'w\',',
    '                     zipfile.ZIP_DEFLATED, compresslevel=6) as z:',
    '    for dp,_,fs in os.walk(\'dist\'):',
    '        for f in fs:',
    '            full = os.path.join(dp,f)',
    '            z.write(full, os.path.relpath(full,\'dist\').replace(os.sep,\'/\'))',
    'PY',
])
para(
    'That writes catherinemonmarson-site.zip one level above the repository, with index.html at '
    'the top level of the archive rather than inside a dist folder.'
)

# ------------------------------------------------------------------ §7 ---

page_break()
para('6. Upload the archive', style='Heading 2')
para(
    'Open Windows PowerShell \u2014 your own window, not an editor\u2019s terminal, because it '
    'must be able to prompt you for a password.'
)

note([
    ('Enter these as three separate lines. ', {'bold': True}),
    ('PowerShell runs each line break immediately, so a long line that wraps when pasted gets '
     'chopped into fragments:', {}),
], colour=WARN)
shot('09-powershell-split-command',
     'What a split command looks like: scp runs with no destination, then the address runs as a command.')

para('Using a variable keeps every line short enough that it cannot happen:')
code([
    'cd C:\\Users\\Xavier\\Documents\\Github',
    '',
    '$dest = "dh_t7jqdj@sin1-shared-02.dreamhost.com:~/catherinemonmarson.seailles.com/"',
    '',
    'scp catherinemonmarson-site.zip $dest',
], label='PowerShell \u2014 one line at a time')

para(
    'The first connection asks about host authenticity \u2014 type yes. Then the password. '
    'Nothing appears as you type, not even dots. That is normal.'
)
shot('13-scp-in-progress', 'Transfer in progress: percentage, size, rate and estimated time remaining.')
shot('14-scp-complete', 'Done. 122 MB at 2 MB/s took one minute to Singapore.')

# ------------------------------------------------------------------ §8 ---

page_break()
para('7. Extract on the server', style='Heading 2')
code('ssh dh_t7jqdj@sin1-shared-02.dreamhost.com', label='PowerShell')
para('Password again. A DreamHost banner and a [sin1-shared-02]$ prompt means you are in.')
shot('12-ssh-login-success', 'Logged in. The earlier failed attempts are visible above the successful one.')

code([
    'cd ~/catherinemonmarson.seailles.com',
    'pwd',
], label='On the server')
note([
    ('Confirm it prints /home/dh_t7jqdj/catherinemonmarson.seailles.com ', {'bold': True}),
    ('before running anything destructive.', {}),
], colour=WARN)

para('Only when replacing the site wholesale', style='Heading 3')
para(
    'Skip this when simply updating \u2014 unzip -o overwrites in place. Run it when the '
    'directory is in a bad state and you want a clean slate:'
)
code('find . -maxdepth 1 -mindepth 1 ! -name \'.dh-diag\' -exec rm -rf {} +')
para(
    'The exclusion keeps .dh-diag, a DreamHost symlink. The find form is deliberate: plain '
    'rm -rf * fails on thousands of filenames and silently skips dotfiles such as .htaccess and '
    '.well-known \u2014 the latter is used for HTTPS certificate renewal, so never delete it '
    'blindly.'
)

para('Extract', style='Heading 3')
code([
    'unzip -o catherinemonmarson-site.zip',
    'rm catherinemonmarson-site.zip',
    'ls -la',
])
para(
    'The -o flag overwrites without prompting. About 1,850 lines scroll past. Deleting the '
    'archive afterwards matters \u2014 it is 122 MB sitting in a public directory.'
)
para('The listing should show twelve entries plus the root files:')
code([
    '.htaccess   _astro   atelier   contact   en   expedition',
    'index.html  mentions-legales   merci   oeuvres   presse   series',
    '404.html  robots.txt  favicon.svg  og-default.jpg  sitemap-0.xml',
    'icon-192.png  icon-512.png  apple-touch-icon.png  site.webmanifest',
])
note([
    ('.htaccess only appears with ls -la, not plain ls. ', {'bold': True}),
    ('If it is missing, the custom error page, the security headers and the caching rules are '
     'all inactive.', {}),
], colour=WARN)
para('Then type exit.')

# ------------------------------------------------------------------ §9 ---

page_break()
para('8. Verify', style='Heading 2')
para('Open https://catherinemonmarson.seailles.com \u2014 and press Ctrl+Shift+R.')
note([
    ('A browser tab that saw the site while it was broken caches those failures, ', {'bold': True}),
    ('and an ordinary reload will not clear them. If images look broken, try a private window '
     'before suspecting the server.', {}),
])
para('Checks worth running from any terminal:')
code([
    'curl -s -o /dev/null -w "%{http_code}\\n" https://catherinemonmarson.seailles.com/',
    'curl -s https://catherinemonmarson.seailles.com/no-such-page | grep -c "Page introuvable"',
    'curl -s -D- -o /dev/null https://catherinemonmarson.seailles.com/ | grep -i x-content-type',
])
para(
    'Expect 200, then 1 (the custom French error page proves .htaccess is active), then the '
    'nosniff header. A correct deployment serves all 358 pages in both languages, the '
    'stylesheet, the images, the custom error page, four security headers and two cache policies.'
)

# ----------------------------------------------------------------- §10 ---

para('9. Troubleshooting', style='Heading 2')

para('\u201cConnection reset by \u2026 port 22\u201d, no password prompt', style='Heading 3')
para('The key exchange is being killed. Test another host:')
code('ssh git@github.com')
para(
    'Also reset \u2192 local firewall, see section 4. Only DreamHost \u2192 the SSH toggle has '
    'not propagated; wait ten minutes.'
)
shot('10-connection-reset', 'The connection is reset before any password prompt appears.')

para('\u201cConnection closed by \u2026 port 22\u201d after the password prompt', style='Heading 3')
shot('11-password-not-propagated',
     'Reaching the password prompt means SSH works. This is a password that has not propagated.')
para(
    'Almost always a password change that has not reached the server yet. Wait ten minutes and '
    'retry before resetting it again.'
)

para('\u201cThe term \u2026 is not recognized as the name of a cmdlet\u201d', style='Heading 3')
para('A pasted command was split across lines. Use the $dest variable form in section 6.')

para('The site loads but has no styling', style='Heading 3')
shot('00-symptom-unstyled-site',
     'The symptom: correct text, no stylesheet, broken images. Everything the HTML references is 404ing.')
para('Check whether a subdirectory responds:')
code('curl -s -o /dev/null -w "%{http_code}\\n" https://catherinemonmarson.seailles.com/oeuvres/')
para(
    '404 on a subdirectory while the homepage returns 200 is the signature of a flattened '
    'upload. Re-extract from the archive.'
)

para('unzip flattens everything', style='Heading 3')
para('The archive was built with backslash paths. Rebuild it with the Python script in section 5.')

# ----------------------------------------------------------------- §11 ---

page_break()
para('10. Why not the File Manager', style='Heading 2')
para('The panel\u2019s web File Manager was tried first, and it produced this:')
bullet('All 1,638 files belonging in _astro/ dumped loose in the web root.')
bullet('All 358 pages saved as \u201cindex (1).html\u201d through \u201cindex (356).html\u201d, '
       'because the browser renames each duplicate download.')
bullet('.htaccess renamed to \u201cdownload\u201d.')
bullet('Not one of the ten directories created.')
para(
    'The site served unstyled HTML with broken images. Nothing was recoverable; the directory '
    'had to be cleared and re-extracted. Browser-based file managers are not built for two '
    'thousand files. One archive extracted server-side is the only reliable route.'
)

# ----------------------------------------------------------------- §12 ---

para('11. Making it one command', style='Heading 2')
para(
    'Once an SSH key is in place, no password is needed and deployment becomes a single line.'
)
code('ssh-keygen -t ed25519 -C "catherinemonmarson deploy"', label='PowerShell')
para('Press Enter at each prompt. Then copy the public half:')
code('Get-Content ~\\.ssh\\id_ed25519.pub')
para(
    'In the panel, open Servers & Usage \u2192 Manage SSH Keys, add the key to dh_t7jqdj, and '
    'wait the usual ten minutes. After that, deployment collapses to:'
)
code([
    'npm run build',
    'rsync -az --delete dist/ dh_t7jqdj@sin1-shared-02.dreamhost.com:~/catherinemonmarson.seailles.com/',
])
para(
    'rsync transfers only what changed \u2014 usually a few seconds rather than a minute \u2014 '
    'and --delete removes files no longer in the build, which unzip -o does not do.'
)

para('Moving to catherinemonmarson.com', style='Heading 2')
para('When the real domain is ready, the site itself changes in one place:')
numbered('Edit data/to-confirm.json \u2192 site.url \u2192 https://catherinemonmarson.com')
numbered('Run npm run build.')
numbered('Add the domain under Websites \u2192 Add Website, and enable Let\u2019s Encrypt.')
numbered('Upload and extract into the new domain\u2019s directory, as above.')
numbered('Keep the old subdomain for a few weeks with a redirect.')
para(
    'Canonical links, hreflang, the sitemap, social card URLs, robots.txt and the generated PHP '
    'all derive from that single value.'
)

out = os.path.join(ROOT, 'Catherine-Monmarson-deployment-guide.docx')
doc.save(out)
print(f'written: {out}')
