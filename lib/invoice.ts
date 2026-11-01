import { formatDate, formatTime, money } from "./format";
import type { Booking } from "./types";

// Loaded only when someone downloads an invoice, to keep the normal page light
export async function downloadInvoice(booking: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 56;
  const right = 539;
  let y = 70;

  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(200, 64, 26).text("StudioSpace", left, y);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(90).text("Booking invoice", right, y, { align: "right" });
  y += 18;
  doc.text(`Invoice no. SS-${booking._id.slice(-8).toUpperCase()}`, right, y, { align: "right" });
  y += 14;
  doc.text(`Issued ${formatDate(new Date())}`, right, y, { align: "right" });

  y += 34;
  doc.setDrawColor(220).line(left, y, right, y);
  y += 28;

  const block = (label: string, lines: string[], x: number, top: number) => {
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(120).text(label.toUpperCase(), x, top);
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(30);
    lines.forEach((line, index) => doc.text(line, x, top + 16 + index * 15, { maxWidth: 220 }));
  };
  block("Booked by", [booking.userName, booking.userEmail], left, y);
  block("Host", [booking.hostName, booking.hostEmail], 310, y);
  y += 66;
  block("Studio", [booking.studioTitle, booking.location], left, y);
  block("Session", [formatDate(booking.start), `${formatTime(booking.start)} to ${formatTime(booking.end)}`, `${booking.guests} guest(s)`], 310, y);
  y += 84;

  doc.setFillColor(242, 236, 225).rect(left, y, right - left, 26, "F");
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(30);
  doc.text("Item", left + 10, y + 17);
  doc.text("Amount", right - 10, y + 17, { align: "right" });
  y += 46;

  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 13 : 11).setTextColor(30);
    doc.text(label, left + 10, y);
    doc.text(value, right - 10, y, { align: "right" });
    y += 24;
  };
  row(`Studio time (${money(booking.hourlyRate)} x ${booking.hours} hr)`, money(booking.subtotal));
  row("Refundable security deposit", money(booking.securityDeposit));
  y -= 6;
  doc.line(left, y, right, y);
  y += 24;
  row("Total", money(booking.total), true);

  y += 10;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(90);
  doc.text(`Status: ${booking.status}`, left + 10, y);
  y += 16;
  doc.text("Please show this invoice to your host when you arrive. Thank you for creating with StudioSpace.", left + 10, y, { maxWidth: 460 });

  doc.save(`studiospace-invoice-${booking._id.slice(-8)}.pdf`);
}
