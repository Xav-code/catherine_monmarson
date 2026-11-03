"""
Generates the project status report as a Word document.

Run: python scripts/make-report.py
Output: Catherine-Monmarson-website-status.docx (repo root)
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import date
import os

INK = RGBColor(0x1A, 0x1A, 0x1A)
MUTED = RGBColor(0x5E, 0x64, 0x5F)
ACCENT = RGBColor(0x3F, 0x65, 0x54)   # the raku reduction green used elsewhere
WARN = RGBColor(0x8A, 0x6A, 0x2F)

doc = Document()

# ---------------------------------------------------------------- styles ---

normal = doc.styles["Normal"]
normal.font.name = "Calibri"
normal.font.size = Pt(10.5)
normal.font.color.rgb = INK
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.15
# Make the font apply to east-asian runs too, or Word substitutes.
normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")

for name, size, colour, before, after in [
    ("Heading 1", 18, INK, 22, 8),
    ("Heading 2", 13, ACCENT, 16, 6),
    ("Heading 3", 11, INK, 10, 4),
]:
    st = doc.styles[name]
    st.font.name = "Calibri"
    st.font.size = Pt(size)
    st.font.color.rgb = colour
    st.font.bold = name != "Heading 1"
    st.paragraph_format.space_before = Pt(before)
    st.paragraph_format.space_after = Pt(after)
    st.paragraph_format.keep_with_next = True

for section in doc.sections:
    section.top_margin = Cm(2.2)
    section.bottom_margin = Cm(2.2)
    section.left_margin = Cm(2.4)
    section.right_margin = Cm(2.4)


def para(text="", style=None, bold=False, colour=None, size=None, space_after=None):
    p = doc.add_paragraph(style=style)
    run = p.add_run(text)
    run.bold = bold
    if colour is not None:
        run.font.color.rgb = colour
    if size is not None:
        run.font.size = Pt(size)
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    return p


def rich(parts, style=None, space_after=None):
    """parts: list of (text, {bold, italic, colour, mono})"""
    p = doc.add_paragraph(style=style)
    for text, fmt in parts:
        run = p.add_run(text)
        run.bold = fmt.get("bold", False)
        run.italic = fmt.get("italic", False)
        if fmt.get("mono"):
            run.font.name = "Consolas"
            run.font.size = Pt(9.5)
        if "colour" in fmt:
            run.font.color.rgb = fmt["colour"]
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    return p


def bullet(text, level=0):
    p = doc.add_paragraph(text, style="List Bullet")
    p.paragraph_format.left_indent = Cm(0.6 + 0.5 * level)
    p.paragraph_format.space_after = Pt(3)
    return p


def numbered(text):
    p = doc.add_paragraph(text, style="List Number")
    p.paragraph_format.left_indent = Cm(0.8)
    p.paragraph_format.space_after = Pt(3)
    return p


def code(text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Consolas"
    run.font.size = Pt(9)
    run.font.color.rgb = MUTED
    p.paragraph_format.left_indent = Cm(0.6)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(8)
    return p


def shade(cell, hex_colour):
    el = OxmlElement("w:shd")
    el.set(qn("w:val"), "clear")
    el.set(qn("w:fill"), hex_colour)
    cell._tc.get_or_add_tcPr().append(el)


def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ""
        r = hdr[i].paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        hdr[i].paragraphs[0].paragraph_format.space_after = Pt(2)
        shade(hdr[i], "EDEEEA")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            r = cells[i].paragraphs[0].add_run(str(v))
            r.font.size = Pt(9.5)
            cells[i].paragraphs[0].paragraph_format.space_after = Pt(2)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


# ----------------------------------------------------------------- cover ---

para("Catherine Monmarson", style="Heading 1")
rich([("Website project — status report and deployment guide", {"colour": MUTED})],
     space_after=2)
rich([(f"Prepared for Xavier Faguer · {date.today().strftime('%d %B %Y')}",
       {"colour": MUTED})], space_after=14)

para("Summary", style="Heading 2")
para(
    "A complete bilingual website for the painter and sculptor Catherine Monmarson has been "
    "designed, built and verified. It presents 162 catalogued works across 358 pages in French "
    "and English, with an artwork page built for selling: zoomable images, true-scale room "
    "previews, dimensions in centimetres and inches, prices, and an enquiry route."
)
para(
    "The site is live at catherinemonmarson.seailles.com, served over HTTPS from the "
    "existing DreamHost plan, and has been verified end to end: every page in both "
    "languages, the stylesheet, the images, the custom error page, the security headers "
    "and the caching rules. What remains is content only Catherine can supply, a mail "
    "address to switch the contact form on, and — when she wants it — the "
    "catherinemonmarson.com domain."
)

# ------------------------------------------------------------ what exists --

para("1. What has been built", style="Heading 2")

para("1.1 Research and catalogue", style="Heading 3")
para(
    "Catherine's ArtMajeur profile was harvested into a structured catalogue, together with her "
    "biography, artist statement, exhibition history and press coverage, cross-checked against "
    "her FirstContemporary page and the Provence-Alpes-Côte d'Azur tourism listing. Nothing in "
    "the site's text is invented; the statement and quotations are her own words."
)
table(
    ["Figure", "Value"],
    [
        ["Works catalogued", "162"],
        ["— paintings", "121"],
        ["— sculpture and ceramics", "23"],
        ["— works on paper", "8"],
        ["— land art", "9"],
        ["High-resolution photographs", "162 (36 MB)"],
        ["Works currently for sale", "45, from €209 to €4,799"],
        ["Works marked sold", "69"],
        ["Price on request", "48"],
        ["Series identified", "8"],
        ["Exhibitions recorded", "25 solo and group, 1993–2022"],
    ],
    widths=[7.5, 8.5],
)

para("1.2 Design", style="Heading 3")
para(
    "The brief was a deliberate three-way reference: Artsy's restraint, Singulart's way of "
    "telling the artist's story, and Saatchi Art's handling of sculpture. The result uses a warm "
    "paper ground, no accent colour at all — the paintings are the colour — a single hairline "
    "rule, and one work per screen in editorial sections."
)
bullet("Bilingual: French at the root, English under /en/, with correct hreflang signalling")
bullet("Light and dark themes, following the visitor's own system setting")
bullet("Accessible: AA contrast, visible focus rings, full keyboard path, real alt text per work")
bullet("No framework: hand-written CSS, zero JavaScript on most pages")

para("1.3 Pages", style="Heading 3")
table(
    ["French", "English", "Purpose"],
    [
        ["/", "/en/", "Hero work, three doors, selected works, series"],
        ["/oeuvres", "/en/works", "Full catalogue, filterable, deep-linkable"],
        ["/oeuvres/[œuvre]", "/en/works/[work]", "The sales page"],
        ["/series", "/en/series", "Eight bodies of work"],
        ["/atelier", "/en/studio", "Statement, process, full CV, press"],
        ["/expedition", "/en/shipping", "Packing, times, rates, returns"],
        ["/presse", "/en/press", "Press facts, biography, credited images"],
        ["/contact", "/en/contact", "Enquiry, studio visits, workshops"],
        ["/mentions-legales", "/en/legal", "Legal notice, terms of sale, privacy"],
    ],
    widths=[4.6, 4.6, 7.0],
)

para("1.4 The artwork page", style="Heading 3")
para(
    "This is where a sale happens, so it had the most attention. Each page carries:"
)
bullet("A full-height image stage, click or keyboard to zoom to high resolution")
bullet("An angle strip for multiple views, appearing automatically when a second photograph exists")
bullet(
    "A room preview drawn to true scale against a 3.20 m wall with a 1.75 m human figure — "
    "sculpture stands on a 100 cm plinth"
)
bullet("Dimensions in centimetres and inches, medium stated verbatim, unique-piece and certificate notes")
bullet("Price, and a route to buy or enquire according to value")
bullet("Shipping, returns and payment reassurance, and three further works from the same series")
bullet("Structured data (VisualArtwork, Offer, breadcrumbs) and a social card generated per work")

para("1.5 Technical", style="Heading 3")
table(
    ["Layer", "Choice"],
    [
        ["Framework", "Astro 5, static output"],
        ["Styling", "Hand-written CSS with custom properties"],
        ["Images", "Built to AVIF/WebP with responsive srcset; originals never reach a browser"],
        ["Content", "Generated from the catalogue into one JSON file"],
        ["Repository", "github.com/Xav-code/catherine_monmarson"],
        ["Pages built", "358"],
        ["Audit", "No broken internal links; every page one H1, alt text, canonical and hreflang"],
    ],
    widths=[4.0, 12.0],
)

# --------------------------------------------------------------- problems --

para("2. Problems found and fixed", style="Heading 2")
para(
    "Two defects were found by measuring the rendered pages rather than trusting the code, and "
    "both affected how the work itself appeared."
)

para("2.1 Artwork images were stretched", style="Heading 3")
para(
    "Catalogue images were distorted by up to 50 per cent — square canvases rendered as "
    "portraits. The build writes real width and height attributes on each image, which act as "
    "CSS presentational hints and make the height definite; a maximum height and a maximum width "
    "then clamped each axis independently and broke the ratio. Adding a single base rule restored "
    "the true proportions. The worst remaining deviation across the whole site is 0.9 per cent, "
    "which is sub-pixel rounding."
)

para("2.2 The room preview misrepresented shapes", style="Heading 3")
para(
    "The preview stretched each photograph into the work's true-size footprint. That is correct "
    "only when the photograph is a straight-on record of the work. For a raku vessel standing in "
    "grass it was wrong by 55 per cent. The build now measures whether each photograph's "
    "proportions agree with the stated dimensions: 62 works are shown on the wall at true size, "
    "and the other 52 show a labelled footprint outline instead — the same scale information, "
    "with no false picture of the shape."
)

# -------------------------------------------------------------- deployment -

para("3. Deployment — what has been done", style="Heading 2")

para("3.1 Attempted: Netlify", style="Heading 3")
para(
    "Netlify was the first choice: free, git-connected, with built-in form handling. A site was "
    "created successfully, but the account was suspended by Netlify's automated systems during "
    "the first upload — a new account pushing two thousand files via the command line fits their "
    "abuse heuristics. An appeal briefly restored it; it was suspended again. No deploy completed."
)

para("3.2 Consequence: the build was made host-neutral", style="Heading 3")
para(
    "Only one part of the site was tied to Netlify — the enquiry form. The form destination is "
    "now a configuration value with four options, so the site runs unchanged on Netlify, "
    "Cloudflare Pages, or any Apache host. Security headers, redirects and caching rules are "
    "emitted in each host's own format."
)

para("3.3 Resolved: DreamHost — the site is live", style="Heading 3")
para(
    "The site is now live at catherinemonmarson.seailles.com on the existing DreamHost plan. "
    "This is the better outcome for the contact form: DreamHost provides PHP and outbound "
    "mail, so the form can post to a script on your own domain with no third party, no "
    "monthly submission cap, and no additional account."
)
para(
    "Getting there took three attempts, and the failures are worth recording because they "
    "would otherwise be repeated."
)
bullet(
    "The panel's web File Manager flattened all 1,638 asset files into the web root, saved "
    "each of the 358 pages under a name such as \u201cindex (1).html\u201d, and renamed the "
    ".htaccess configuration file to \u201cdownload\u201d. The result served unstyled text "
    "with broken images."
)
bullet(
    "SSH, the reliable alternative, was blocked by McAfee's firewall on the local machine, "
    "for every host and not only DreamHost. Granting ssh.exe and scp.exe access resolved it."
)
bullet(
    "DreamHost's own SSH switch reported an error while in fact succeeding, and both that "
    "switch and a password change take about ten minutes to reach the server."
)
para(
    "The working method is a single archive uploaded by scp and extracted on the server, "
    "which builds the directory tree correctly. The full procedure, with screenshots of "
    "every step and of each failure mode, is in docs/DEPLOYMENT.md in the repository.",
    space_after=4,
)
rich([
    ("Two traps worth knowing. ", {"bold": True}),
    ("A download of the repository from GitHub is ", {}),
    ("not", {"italic": True}),
    (" the website — it contains the source, and the site is generated output that is "
     "deliberately excluded from version control. And an archive made with Windows' built-in "
     "compression writes paths that Linux extraction flattens; the project includes a script "
     "that packages it correctly.", {}),
])

para("3.4 The contact form today", style="Heading 3")
rich([
    ("The contact page currently shows Catherine's email address rather than a form. ", {}),
    ("This is deliberate: ", {"bold": True}),
    ("a form that posts to a handler with no valid sending address would accept every enquiry "
     "and silently discard it. Showing the address loses nothing. The form returns as soon as a "
     "sending address exists — see step 2 below.", {}),
])

# ------------------------------------------------------------- remaining ---

doc.add_page_break()
para("4. Remaining steps", style="Heading 2")
para(
    "In the order they should be done. Steps 1 to 3 give a fully working site on the interim "
    "address; steps 4 and 5 move it to catherinemonmarson.com; step 6 is content quality."
)

para("Step 1 — Done: the site is live", style="Heading 3")
para(
    "Completed on 3 November 2026 and verified from outside: all 358 pages in both languages "
    "respond correctly, the stylesheet and images load, the French error page appears on a bad "
    "address, and the four security headers and two caching policies are active. HTTPS is in "
    "place through Let's Encrypt."
)
rich([
    ("If a page ever looks unstyled after a future upload, ", {"bold": True}),
    ("press Ctrl+Shift+R first. A browser tab that saw a broken version caches those failures, "
     "and an ordinary reload does not clear them.", {}),
])

para("Step 2 — Turn the contact form on", style="Heading 3")
rich([("This is the only step needed for a fully working enquiry form.", {"bold": True})], space_after=4)
numbered("In the DreamHost panel, Mail → Manage Email, create an address on seailles.com, for example catherine@seailles.com.")
numbered("Record it in data/to-confirm.json as forms.mailFrom, and set forms.provider to \"php\".")
numbered("Rebuild and re-upload, following docs/DEPLOYMENT.md sections 6 to 8. The handler is generated automatically; nothing else needs editing.")
para("", space_after=2)
rich([
    ("Why it cannot be her Wanadoo address. ", {"bold": True}),
    ("A shared host will only send mail claiming to come from a domain it hosts. Mail sent as "
     "cathy.monmarson@wanadoo.fr would be rejected or filed as spam. The addresses therefore "
     "divide as follows:", {}),
])
table(
    ["Header", "Address", "Why"],
    [
        ["From", "…@seailles.com", "The envelope DreamHost is permitted to send"],
        ["To", "cathy.monmarson@wanadoo.fr", "Where the enquiry lands"],
        ["Reply-To", "The enquirer", "So replying in her mail client reaches the buyer"],
    ],
    widths=[2.8, 5.6, 7.6],
)
para("The handler already validates submissions, blocks bots with a honeypot, caps message "
     "length, and strips line breaks from anything reaching a mail header — the standard route "
     "by which contact forms are abused as spam relays. This was tested against a live PHP "
     "server before shipping.")

para("Step 3 — Confirm the legal and commercial details", style="Heading 3")
para("These are required on a French site that sells, and only Catherine can supply them. "
     "Running npm run prelaunch lists what is outstanding at any time.")
table(
    ["Item", "Why it is needed"],
    [
        ["SIRET number", "Legally required on a French commercial site"],
        ["Artist-author status", "For example Maison des Artistes, or auto-entrepreneur"],
        ["VAT position", "Currently assumed to be franchise en base, article 293 B"],
        ["Shipping rates", "France and EU, under and over 100 cm. Currently the page says cost is quoted per work"],
        ["Consumer mediator", "Mandatory for distance selling. Roughly €30 a year via CM2C or Medicys"],
        ["Price confirmation", "The 45 prices came from ArtMajeur and may be out of date"],
    ],
    widths=[4.6, 11.4],
)

para("Step 4 — Register catherinemonmarson.com", style="Heading 3")
numbered("Register the domain. Roughly €12 to €15 a year. Registering catherinemonmarson.fr as well and redirecting it is worth the few euros, since her market is French.")
numbered("Either add it to the existing DreamHost plan, or point its nameservers at DreamHost. Adding it to the plan is simpler and costs nothing extra.")
numbered("In the DreamHost panel, host the new domain and enable Let's Encrypt for it.")

para("Step 5 — Move the site to the new domain", style="Heading 3")
numbered("Change one value: site.url in data/to-confirm.json, to https://catherinemonmarson.com.")
numbered("Rebuild and upload to the new domain's folder. Everything else follows automatically — canonical links, hreflang, the sitemap, social cards and robots.txt all derive from that single value.")
numbered("Create the sending address on the new domain, for example contact@catherinemonmarson.com, and update forms.mailFrom.")
numbered("Keep the old subdomain for a few weeks with a redirect to the new address, so nothing already shared breaks.")
numbered("Submit the sitemap at catherinemonmarson.com/sitemap-index.xml to Google Search Console.")
para("", space_after=2)
rich([
    ("A useful extra. ", {"bold": True}),
    ("Once the domain exists, a forwarding alias such as contact@catherinemonmarson.com pointing "
     "to her Wanadoo inbox keeps her personal address off the public pages, where it would "
     "otherwise be harvested by spam robots.", {}),
])

para("Step 6 — Content quality", style="Heading 3")
para("None of this blocks the site from working, but it is what separates a complete site from "
     "a working one. In priority order:")
table(
    ["What is missing", "Count", "Effect"],
    [
        ["Titles", "55 works", "They display as “Sans titre”"],
        ["Years", "88 works", "No date shown"],
        ["Dimensions", "48 works", "No room preview, no size filter"],
        ["Depth for sculpture", "23 works", "Height and width are known; depth is not"],
        ["Second photographs", "All works", "The angle strip never appears"],
        ["Studio photographs", "6–8 needed", "The studio page has no images of her working"],
        ["A raku firing video", "1", "The single most persuasive asset for ceramics"],
    ],
    widths=[5.2, 2.6, 8.2],
)
para("A worksheet has been prepared to collect the first four. Running npm run worksheet "
     "produces a printable document showing every unfinished work with its photograph, its "
     "reference number and ruled lines to write on, plus a spreadsheet that opens directly in "
     "French Excel. Catherine's answers go into one file and override the harvested data.")

# ----------------------------------------------------------------- upkeep --

para("5. Keeping the site up to date", style="Heading 2")
para("Four commands cover everything. Each is run from the project folder.")
table(
    ["Command", "What it does"],
    [
        ["npm run dev", "Runs the site locally at localhost:4321 with live reload"],
        ["npm run build", "Produces the uploadable site in the dist folder"],
        ["npm run prelaunch", "Lists what is still outstanding before the site should be promoted"],
        ["npm run worksheet", "Regenerates the sheets for Catherine to fill in"],
    ],
    widths=[4.6, 11.4],
)
para("To add a work: place the photograph in media/originals, add its details to the catalogue "
     "file, rebuild. To add a second view of a work, name the file with a -2 suffix and the "
     "angle strip appears by itself.")
para(
    "Publishing a change is then: build, package the output, upload it by scp and extract it "
    "over SSH — about five minutes, fully documented in docs/DEPLOYMENT.md. Adding an SSH key, "
    "described in section 12 of that document, reduces it to a single rsync command that "
    "transfers only what changed."
)

para("A note on automation", style="Heading 3")
para(
    "Uploading by hand is fine for now, but it is the one manual step in an otherwise automated "
    "chain. Connecting the repository to a host that builds on push — Cloudflare Pages is free "
    "and has no account history to overcome — would mean changes go live by committing them, "
    "with no upload at all. Worth revisiting once the content is settled."
)

# ---------------------------------------------------------------- closing --

para("6. Where the project stands", style="Heading 2")
table(
    ["", "Status"],
    [
        ["Design and build", "Complete"],
        ["162 works catalogued and published", "Complete"],
        ["Bilingual French and English", "Complete"],
        ["Accessibility and SEO", "Complete and audited"],
        ["Source code committed and pushed", "Complete"],
        ["Deployment procedure documented", "Complete, with screenshots"],
        ["Live on catherinemonmarson.seailles.com", "Done, verified"],
        ["Working contact form", "Needs a sending address — step 2"],
        ["Legal and commercial details", "Needs Catherine — step 3"],
        ["catherinemonmarson.com", "Not started — steps 4 and 5"],
        ["Titles, dates and studio photographs", "Needs Catherine — step 6"],
    ],
    widths=[8.6, 7.4],
)

para("", space_after=2)
rich([
    ("The shortest path to a site worth sharing: ", {"bold": True}),
    ("create one email address on seailles.com and turn the contact form back on — about ten "
     "minutes — then give Catherine the worksheet so the untitled works can be named. The "
     "legal details can follow, and the domain whenever she wants her own name on it: that is "
     "a one-line change.", {}),
])

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "Catherine-Monmarson-website-status.docx")
doc.save(out)
print(f"written: {out}")
