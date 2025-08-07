import jsPDF from "jspdf";

export const downloadPDF = (text) => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180); // wrap text to fit page width
  doc.text(lines, 10, 10);
  doc.save("itinerary.pdf");
};
