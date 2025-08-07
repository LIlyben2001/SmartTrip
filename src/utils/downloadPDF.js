import jsPDF from "jspdf";

export function downloadPDF(content) {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180); // Wrap long lines
  doc.text(lines, 10, 10);
  doc.save("trip-itinerary.pdf");
}
