export function downloadTextFile(filename, text) {
  // Create a new Blob with the text content
  const blob = new Blob([text], { type: 'text/plain' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append link, trigger click, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Free up memory
  URL.revokeObjectURL(link.href);
}
