/**
 * Generate iCalendar (.ics) file for service bookings
 * Compatible with Google Calendar, Outlook, Apple Calendar, etc.
 */

interface CalendarEventData {
  bookingNumber: string
  serviceName: string
  startDateTime: Date // Full date-time in local timezone
  endDateTime: Date // Full date-time in local timezone
  customerName: string
  customerEmail: string
  location?: string
  description?: string
  organizerEmail?: string
  organizerName?: string
}

/**
 * Format date to iCalendar format: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Escape special characters for iCalendar format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate iCalendar (.ics) content
 */
export function generateCalendarInvite(data: CalendarEventData): string {
  const now = new Date()
  const uid = `booking-${data.bookingNumber}@subercraftex.com`
  const dtstamp = formatICalDate(now)
  const dtstart = formatICalDate(data.startDateTime)
  const dtend = formatICalDate(data.endDateTime)

  const organizerEmail = data.organizerEmail || process.env.SMTP_FROM_EMAIL || 'noreply@subercraftex.com'
  const organizerName = data.organizerName || process.env.SMTP_FROM_NAME || 'SuberCraftex'

  const description = data.description || `Service booking for ${data.serviceName}. Booking #${data.bookingNumber}`
  const location = data.location || 'SuberCraftex Studio'

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SuberCraftex//Service Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICalText(data.serviceName)} - SuberCraftex`,
    `DESCRIPTION:${escapeICalText(description)}`,
    `LOCATION:${escapeICalText(location)}`,
    `ORGANIZER;CN=${escapeICalText(organizerName)}:mailto:${organizerEmail}`,
    `ATTENDEE;CN=${escapeICalText(data.customerName)};RSVP=TRUE:mailto:${data.customerEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H', // 24 hours before
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICalText(data.serviceName)} tomorrow`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H', // 1 hour before
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICalText(data.serviceName)} in 1 hour`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

/**
 * Generate base64 encoded calendar invite for email attachment
 */
export function generateCalendarInviteBase64(data: CalendarEventData): string {
  const icsContent = generateCalendarInvite(data)
  return Buffer.from(icsContent).toString('base64')
}

/**
 * Create calendar event from booking data
 */
export function createBookingCalendarEvent(booking: {
  bookingNumber: string
  serviceName: string
  scheduledDate: Date
  scheduledTime: string
  duration: number
  customerName: string
  customerEmail: string
  location?: string
}) {
  // Parse time string (e.g., "14:30")
  const [hours, minutes] = booking.scheduledTime.split(':').map(Number)

  // Create start date-time
  const startDateTime = new Date(booking.scheduledDate)
  startDateTime.setHours(hours, minutes, 0, 0)

  // Create end date-time
  const endDateTime = new Date(startDateTime)
  endDateTime.setMinutes(endDateTime.getMinutes() + booking.duration)

  return generateCalendarInviteBase64({
    bookingNumber: booking.bookingNumber,
    serviceName: booking.serviceName,
    startDateTime,
    endDateTime,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    location: booking.location,
    description: `Your ${booking.serviceName} appointment at SuberCraftex.\n\nBooking #${booking.bookingNumber}\nDuration: ${booking.duration} minutes`,
  })
}
