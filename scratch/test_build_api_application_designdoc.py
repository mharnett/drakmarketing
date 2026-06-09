"""Shape test for the Drak Marketing API-application design-doc PDF generator.

The generator emits a fixed-layout PDF. Unit-asserting f(x)==y has nothing to
bite on, so we assert on the *output shape*: running the script produces a
non-trivial, valid PDF whose byte stream carries the identifiers that MUST be
present for the document to be correct for its purpose (the right MCC and the
agency framing). A wrong MCC ID or a copy that silently dropped the manager
account is exactly the bug class a "did it run?" smoke check would miss.
"""
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
SCRIPT = HERE / "build_api_application_designdoc.py"
OUT_NAME = "drakmarketing-google-ads-api-application-designdoc.pdf"


def _run_generator(workdir: Path) -> Path:
    shutil.copy(SCRIPT, workdir / SCRIPT.name)
    subprocess.run([sys.executable, SCRIPT.name], cwd=workdir, check=True)
    return workdir / OUT_NAME


def test_emits_valid_nontrivial_pdf(tmp_path):
    pdf = _run_generator(tmp_path)
    assert pdf.exists(), "generator did not write the PDF"
    data = pdf.read_bytes()
    assert data[:5] == b"%PDF-", "output is not a PDF"
    assert data.rstrip().endswith(b"%%EOF"), "PDF is truncated / not finalized"
    assert len(data) > 4000, f"PDF suspiciously small ({len(data)} bytes)"


def test_carries_required_identifiers(tmp_path):
    # PDF metadata (title/author) is stored as plaintext in the byte stream,
    # so we can assert the doc is bound to the right account without a PDF parser.
    data = _run_generator(tmp_path).read_bytes()
    assert b"676-139-6070" in data, "Drak Marketing MCC ID missing from PDF"
    assert b"Drak Marketing" in data, "agency name missing from PDF"
    # Guard against accidentally shipping the Forcepoint MCC in the Drak doc.
    assert b"444-016-4705" not in data, "Forcepoint MCC leaked into the Drak doc"
