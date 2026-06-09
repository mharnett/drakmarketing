#!/usr/bin/env python3
"""One-off generator: renders the Drak Marketing Google Ads API access application design doc to PDF.

Produces: drakmarketing-google-ads-api-application-designdoc.pdf
Attach this to the Drak Marketing MCC (676-139-6070) Basic Access application form.
"""
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem, HRFlowable,
)

OUT = "drakmarketing-google-ads-api-application-designdoc.pdf"

NAVY = colors.HexColor("#1f3a5f")
GREY = colors.HexColor("#5a6472")
LIGHT = colors.HexColor("#eef2f7")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle("DocTitle", parent=styles["Title"], fontSize=22, textColor=NAVY, spaceAfter=4, leading=26))
styles.add(ParagraphStyle("SubTitle", parent=styles["Normal"], fontSize=11, textColor=GREY, spaceAfter=2))
styles.add(ParagraphStyle("H2", parent=styles["Heading2"], fontSize=13.5, textColor=NAVY, spaceBefore=14, spaceAfter=6, leading=16))
styles.add(ParagraphStyle("H3", parent=styles["Heading3"], fontSize=11.5, textColor=NAVY, spaceBefore=8, spaceAfter=3))
styles.add(ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14.5, spaceAfter=6, alignment=TA_LEFT))
styles.add(ParagraphStyle("Cell", parent=styles["Normal"], fontSize=9, leading=12))
styles.add(ParagraphStyle("CellB", parent=styles["Normal"], fontSize=9, leading=12, textColor=NAVY, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle("Bull", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=2))

def P(t, s="Body"): return Paragraph(t, styles[s])
def cell(t, b=False): return Paragraph(t, styles["CellB" if b else "Cell"])

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(i, styles["Bull"]), leftIndent=10, value="•") for i in items],
        bulletType="bullet", start="•", leftIndent=14, spaceBefore=2, spaceAfter=6,
    )

def kv_table(rows, col_widths):
    t = Table(rows, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c8d2de")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t

story = []
story.append(P("Google Ads API — Application Design Document", "DocTitle"))
story.append(P("Submitted in support of a Basic Access application", "SubTitle"))
story.append(P("Manager account (MCC): Drak Marketing — 676-139-6070", "SubTitle"))
story.append(P("Date: June 2026 &nbsp;•&nbsp; Version 1.0", "SubTitle"))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY))
story.append(Spacer(1, 8))

story.append(P("1. Application Overview", "H2"))
story.append(P(
    "Drak Marketing is a paid-media agency that manages Google Ads accounts on behalf of its clients. "
    "Drak operates an internal toolset that connects to the Google Ads API to (a) generate reporting and "
    "campaign-management workflows across the client accounts it manages, and (b) upload offline conversion "
    "values derived from each client's CRM to support Value-Based Bidding. The application is used solely by "
    "Drak Marketing staff to manage client accounts that are linked under the Drak Marketing manager account "
    "(676-139-6070). It is not a public product and is not resold to third parties; every account it touches is "
    "one Drak has been authorized to manage by the client."))

story.append(P("2. Tool Type & Users", "H2"))
story.append(kv_table([
    [cell("Attribute", True), cell("Detail", True)],
    [cell("Tool type"), cell("Internal agency tool (used by Drak Marketing to manage client accounts under its MCC)")],
    [cell("Primary users"), cell("Drak Marketing account managers and analysts")],
    [cell("Accounts accessed"), cell("Client Google Ads accounts linked under Drak Marketing MCC 676-139-6070, each managed under written client authorization")],
    [cell("Distribution"), cell("Not distributed. Runs in Drak Marketing's controlled environment only.")],
    [cell("Monetization"), cell("The tool itself is not sold or licensed. Drak charges clients for management services, not for API access.")],
], [1.6*inch, 4.6*inch]))

story.append(P("3. What the Application Does", "H2"))
story.append(P("The application has two functional components:", "Body"))
story.append(P("3.1 Reporting & Campaign Management", "H3"))
story.append(P(
    "An operator-driven interface (a Model Context Protocol server invoked by an internal assistant) that issues "
    "Google Ads Query Language (GAQL) read queries and a controlled set of mutate operations. Typical operations: "
    "pulling campaign / ad group / keyword / search-term performance, reviewing Quality Score and ad strength, and "
    "applying routine optimizations (pausing keywords, adding negative keywords, updating budgets and bidding, "
    "creating responsive search ads). All mutating actions are initiated and reviewed by a human operator."))
story.append(P("3.2 Offline Conversion Upload (Value-Based Bidding)", "H3"))
story.append(P(
    "For clients that opt in, a scheduled pipeline reads lead and opportunity outcomes from the client's CRM "
    "(e.g. HubSpot, Salesforce), assigns each a conversion value based on firmographic and funnel attributes, and "
    "uploads those values against existing conversion actions via click-based offline conversion imports. This lets "
    "Google's Smart Bidding optimize toward high-value leads rather than raw form fills. Uploads are matched on "
    "Google Click Identifier (GCLID); no personally identifiable information is sent to Google."))

story.append(P("4. Google Ads API Usage", "H2"))
story.append(kv_table([
    [cell("Service / feature", True), cell("Access", True), cell("Purpose", True)],
    [cell("GoogleAdsService (Search / SearchStream, GAQL)"), cell("Read"), cell("Performance reporting across campaigns, ad groups, keywords, search terms, conversions")],
    [cell("ConversionUploadService (ClickConversions)"), cell("Write"), cell("Upload offline conversion values for Value-Based Bidding")],
    [cell("ConversionActionService"), cell("Read"), cell("Resolve conversion actions used by the upload pipeline")],
    [cell("CampaignService / CampaignBudgetService / CampaignBidding"), cell("Write"), cell("Routine, human-approved budget and bidding adjustments")],
    [cell("AdGroupCriterionService / SharedSet (negatives, keywords)"), cell("Write"), cell("Keyword pauses and negative-keyword management")],
    [cell("AdGroupAdService (RSAs)"), cell("Write"), cell("Create / update responsive search ads")],
], [2.7*inch, 0.7*inch, 2.8*inch]))
story.append(Spacer(1, 4))
story.append(P(
    "<b>Estimated daily volume:</b> on the order of a few thousand API operations per day across all managed "
    "client accounts (reporting queries plus scheduled offline-conversion upload batches). Well within Basic "
    "Access limits.", "Body"))

story.append(P("5. System Architecture & Data Flow", "H2"))
story.append(P("Reporting path:", "H3"))
story.append(bullets([
    "Operator issues a request → internal assistant translates it to a GAQL query or a specific mutate operation.",
    "Request is sent to the Google Ads API authenticated via OAuth 2.0 with login-customer-id = 676-139-6070.",
    "Results are returned to the operator. Mutations require explicit human initiation.",
]))
story.append(P("Offline-conversion path:", "H3"))
story.append(bullets([
    "Scheduled job reads closed/qualified records from the client's CRM (client-controlled systems).",
    "Each record is scored to a conversion value using firmographic + funnel attributes (no PII in scoring output).",
    "Records carrying a valid GCLID are uploaded as ClickConversions against existing conversion actions.",
    "A daily summary is logged for audit; failures alert Drak Marketing operations.",
]))

story.append(P("6. Authentication & Credentials", "H2"))
story.append(kv_table([
    [cell("Credential", True), cell("Source / owner", True)],
    [cell("Developer token"), cell("Generated from the Drak Marketing MCC (676-139-6070) API Center")],
    [cell("OAuth 2.0 client (client ID / secret)"), cell("Drak Marketing-controlled Google Cloud project")],
    [cell("Refresh token"), cell("Minted by a Drak Marketing-authorized user with access to the managed accounts")],
    [cell("login-customer-id"), cell("676-139-6070 (Drak Marketing MCC)")],
], [2.4*inch, 3.8*inch]))

story.append(P("7. Data Handling & Compliance", "H2"))
story.append(bullets([
    "<b>No PII sent to Google.</b> Offline conversion uploads are matched on GCLID and carry only a conversion action, timestamp, and value. Email/phone are never transmitted.",
    "<b>Client data stays in client systems.</b> CRM records reside in the client's HubSpot / Salesforce; the pipeline reads outcomes and writes only aggregate conversion values to Google Ads.",
    "<b>Authorized account access only.</b> Drak manages each account under written client authorization; accounts are linked under the Drak MCC and access is removed when an engagement ends.",
    "<b>Least-privilege credentials.</b> OAuth scopes are limited to the Google Ads API; the developer token and OAuth client are owned by Drak Marketing.",
    "<b>Human-in-the-loop mutations.</b> All campaign-changing operations are operator-initiated and reviewed.",
    "<b>Adherence to Google Ads API policies</b> and the Required Minimum Functionality, including accurate reporting and respect for account access scope.",
]))

story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=0.5, color=GREY))
story.append(P(
    "<font size=8 color='#5a6472'>This document describes an internal agency tool used by Drak Marketing to manage "
    "client Google Ads accounts under MCC 676-139-6070. Contact: Drak Marketing — mark@drakmarketing.com.</font>", "Body"))

doc = SimpleDocTemplate(
    OUT, pagesize=LETTER,
    leftMargin=0.85*inch, rightMargin=0.85*inch, topMargin=0.8*inch, bottomMargin=0.7*inch,
    title="Google Ads API Application Design Document — Drak Marketing MCC 676-139-6070",
    author="Drak Marketing",
)
doc.build(story)
print(f"wrote {OUT}")
