import jsPDF from 'jspdf';
import { CertificateTheme, getThemeByOrderNumber } from './certificateThemes';
import { format } from 'date-fns';

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  courseOrderNumber: number;
  verificationCode: string;
  issuedAt: string;
}

// Draw decorative border
function drawBorder(doc: jsPDF, theme: CertificateTheme) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  // Outer border
  doc.setDrawColor(theme.borderColor);
  doc.setLineWidth(3);
  doc.rect(margin, margin, width - margin * 2, height - margin * 2);
  
  // Inner border
  doc.setLineWidth(1);
  doc.rect(margin + 5, margin + 5, width - margin * 2 - 10, height - margin * 2 - 10);
  
  // Corner decorations
  const cornerSize = 20;
  doc.setLineWidth(2);
  
  // Top-left corner
  doc.line(margin, margin + cornerSize, margin + cornerSize, margin);
  
  // Top-right corner
  doc.line(width - margin - cornerSize, margin, width - margin, margin + cornerSize);
  
  // Bottom-left corner
  doc.line(margin, height - margin - cornerSize, margin + cornerSize, height - margin);
  
  // Bottom-right corner
  doc.line(width - margin - cornerSize, height - margin, width - margin, height - margin - cornerSize);
}

// Draw art deco style border
function drawArtDecoBorder(doc: jsPDF, theme: CertificateTheme) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 12;
  
  doc.setDrawColor(theme.primaryColor);
  
  // Main border
  doc.setLineWidth(4);
  doc.rect(margin, margin, width - margin * 2, height - margin * 2);
  
  // Inner decorative lines
  doc.setLineWidth(1);
  doc.rect(margin + 8, margin + 8, width - margin * 2 - 16, height - margin * 2 - 16);
  
  // Art deco corner decorations
  const cs = 25;
  doc.setLineWidth(2);
  
  // Top corners - stepped lines
  for (let i = 0; i < 3; i++) {
    const offset = i * 4;
    doc.line(margin + offset, margin + cs - offset, margin + cs - offset, margin + offset);
    doc.line(width - margin - offset, margin + cs - offset, width - margin - cs + offset, margin + offset);
  }
  
  // Bottom corners
  for (let i = 0; i < 3; i++) {
    const offset = i * 4;
    doc.line(margin + offset, height - margin - cs + offset, margin + cs - offset, height - margin - offset);
    doc.line(width - margin - offset, height - margin - cs + offset, width - margin - cs + offset, height - margin - offset);
  }
}

// Draw cyberpunk style border
function drawCyberpunkBorder(doc: jsPDF, theme: CertificateTheme) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 10;
  
  // Neon glow effect (multiple lines)
  doc.setDrawColor(theme.primaryColor);
  doc.setLineWidth(4);
  doc.rect(margin, margin, width - margin * 2, height - margin * 2);
  
  doc.setDrawColor(theme.secondaryColor);
  doc.setLineWidth(2);
  doc.rect(margin + 3, margin + 3, width - margin * 2 - 6, height - margin * 2 - 6);
  
  // Circuit-like decorations in corners
  doc.setLineWidth(1);
  doc.setDrawColor(theme.accentColor);
  
  // Top-left circuit
  doc.line(margin + 15, margin + 5, margin + 35, margin + 5);
  doc.line(margin + 35, margin + 5, margin + 35, margin + 15);
  doc.line(margin + 5, margin + 15, margin + 5, margin + 35);
  doc.line(margin + 5, margin + 35, margin + 15, margin + 35);
  
  // Top-right circuit
  doc.line(width - margin - 15, margin + 5, width - margin - 35, margin + 5);
  doc.line(width - margin - 35, margin + 5, width - margin - 35, margin + 15);
  doc.line(width - margin - 5, margin + 15, width - margin - 5, margin + 35);
  doc.line(width - margin - 5, margin + 35, width - margin - 15, margin + 35);
}

export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  const theme = getThemeByOrderNumber(data.courseOrderNumber);
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  
  // Set background color
  doc.setFillColor(theme.backgroundColor);
  doc.rect(0, 0, width, height, 'F');
  
  // Draw appropriate border based on theme
  if (theme.fontStyle === 'art-deco') {
    drawArtDecoBorder(doc, theme);
  } else if (theme.fontStyle === 'cyberpunk') {
    drawCyberpunkBorder(doc, theme);
  } else {
    drawBorder(doc, theme);
  }
  
  let yPosition = 40;
  
  // Academy Logo/Name
  doc.setTextColor(theme.primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('SOLOSUCCESS ACADEMY', width / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Certificate Title
  doc.setTextColor(theme.textColor);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate of Completion', width / 2, yPosition, { align: 'center' });
  
  yPosition += 12;
  
  // Decorative line
  doc.setDrawColor(theme.primaryColor);
  doc.setLineWidth(1);
  doc.line(width / 2 - 60, yPosition, width / 2 + 60, yPosition);
  
  yPosition += 18;
  
  // Course Title
  doc.setTextColor(theme.primaryColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.courseTitle, width / 2, yPosition, { align: 'center' });
  
  yPosition += 18;
  
  // Certification text
  doc.setTextColor(theme.textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', width / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Student Name
  doc.setTextColor(theme.primaryColor);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentName, width / 2, yPosition, { align: 'center' });
  
  // Underline for name
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(theme.secondaryColor);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - nameWidth / 2 - 10, yPosition + 3, width / 2 + nameWidth / 2 + 10, yPosition + 3);
  
  yPosition += 18;
  
  // Completion text
  doc.setTextColor(theme.textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed all requirements for the course', width / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.text('and is hereby awarded this certificate of achievement.', width / 2, yPosition, { align: 'center' });
  
  yPosition += 25;
  
  // Footer section
  const footerY = height - 35;
  
  // Issue Date (left)
  doc.setFontSize(10);
  doc.setTextColor(theme.textColor);
  doc.text('Issued:', 40, footerY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(new Date(data.issuedAt), 'MMMM d, yyyy'), 40, footerY + 6);
  
  // Signature (center)
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(theme.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - 30, footerY + 2, width / 2 + 30, footerY + 2);
  doc.setFontSize(9);
  doc.text('SoloSuccess Academy', width / 2, footerY + 8, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(theme.secondaryColor);
  doc.text('Course Instructor', width / 2, footerY + 12, { align: 'center' });
  
  // Verification Code (right)
  doc.setTextColor(theme.textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Verification:', width - 70, footerY, { align: 'left' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.primaryColor);
  doc.text(data.verificationCode, width - 70, footerY + 6, { align: 'left' });
  
  // Small verification URL
  doc.setFontSize(7);
  doc.setTextColor(theme.textColor);
  doc.setFont('helvetica', 'normal');
  doc.text('verify at: solosuccess.academy/verify', width - 70, footerY + 11, { align: 'left' });
  
  return doc;
}

export function downloadCertificate(data: CertificateData) {
  const doc = generateCertificatePDF(data);
  const filename = `Certificate-${data.courseTitle.replace(/\s+/g, '-')}-${data.studentName.replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}
