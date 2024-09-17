import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

export const generatePDF = async (userData: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Title of the document
  page.drawText('Premium Finance Agreement', {
    x: 50,
    y: 800,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  // Add User's Contact Info (from Add1)
  const { Add1 } = userData;
  page.drawText(`Name: ${Add1.firstName} ${Add1.lastName}`, {
    x: 50,
    y: 750,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Email: ${Add1.email}`, {
    x: 50,
    y: 730,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Contact: ${Add1.contact}`, {
    x: 50,
    y: 710,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Address: ${Add1.address}, ${Add1.city}, ${Add1.state}, ${Add1.zip}`, {
    x: 50,
    y: 690,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // Add Business Information (from Add2)
  const { Add2 } = userData;
  const business = Add2[0]; // Assuming we take the first business
  page.drawText(`Business Name: ${business.BuisnessName}`, {
    x: 50,
    y: 650,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Business Address: ${business.Address}, ${business.city}, ${business.state}, ${business.Zip}`, {
    x: 50,
    y: 630,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // Add Quotes Information
  const { quotes } = userData;
  const quote = quotes[0]; // Assuming we take the first quote
  page.drawText(`Quote Number: ${quote.quoteNumber}`, {
    x: 50,
    y: 600,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Policy Number: ${quote.policyNumber}`, {
    x: 50,
    y: 580,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Coverage: ${quote.coverage}`, {
    x: 50,
    y: 560,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Premium: $${quote.premium}`, {
    x: 50,
    y: 540,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'agreement.pdf');
};
