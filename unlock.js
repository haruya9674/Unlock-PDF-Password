async function unlock() {
  const fileInput = document.getElementById("file");
  const password = document.getElementById("password").value;

  if (!fileInput.files.length) {
    alert("PDFを選択してください");
    return;
  }

  const file = fileInput.files[0];
  const bytes = await file.arrayBuffer();

  try {
    const pdfDoc = await PDFLib.PDFDocument.load(bytes, { password });
    const newPdf = await PDFLib.PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(p => newPdf.addPage(p));

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "unlocked.pdf";
    a.click();
  } catch {
    alert("パスワードが間違っているか、解除できないPDFです");
  }
}
