export async function downloadPDF(itinerary) {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF();
  const lines = itinerary.split("\n");
  let y = 10;

  doc.setFont("Helvetica");
  doc.setFontSize(12);

  lines.forEach((line) => {
    const splitText = doc.splitTextToSize(line, 180);
    splitText.forEach((subLine) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(subLine, 10, y);
      y += 7;
    });
  });

  doc.save("SmartTrip-Itinerary.pdf");
}
