import { NextRequest, NextResponse } from 'next/server';
import { sendContactAutoReply, sendAdminEmail, emailShell, FROM_EMAIL, escapeHtml } from '@/lib/email';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// Rate limit: 3 contact form submissions per minute per IP
const contactLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 3 });

export async function POST(request: NextRequest) {
  // Rate limit contact form to prevent spam
  const limitError = contactLimiter(request);
  if (limitError) return limitError;
  try {
    const body = await request.json();
    const { name, email, message, accountType, organizationName } = body;

    // Validate required fields
    if (!name || !email || !message || !accountType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message, and accountType are required.' },
        { status: 400 }
      );
    }

    // Validate accountType
    const validAccountTypes = ['individual', 'university', 'business'];
    if (!validAccountTypes.includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid accountType. Must be one of: individual, university, business.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const typeLabel = accountType === 'university' ? 'University/College' : accountType === 'business' ? 'Business' : 'Individual';

    // Send auto-reply to the user
    await sendContactAutoReply(name, email, accountType);

    // Send admin notification — escape all user-controlled data to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOrg = organizationName ? escapeHtml(organizationName) : '';
    const orgLine = safeOrg
      ? `<div class="detail-row"><span class="detail-label">Organization</span><span class="detail-value">${safeOrg}</span></div>`
      : '';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    await sendAdminEmail(
      `New Contact Form Submission from ${name}`,
      emailShell('New Contact Submission',
        `<div class="content">
          <p class="greeting">New contact form submission</p>
          <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${safeName}</span></div>
          <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${safeEmail}</span></div>
          <div class="detail-row"><span class="detail-label">Account Type</span><span class="detail-value">${typeLabel}</span></div>
          ${orgLine}
          <hr class="divider" />
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>`),
      'contact_notification'
    );

    // Log the auto-reply email as well
    try {
      await db.emailLog.create({
        data: {
          to: email,
          from: FROM_EMAIL,
          subject: 'We received your message — TestCEFR',
          type: 'contact_auto_reply',
          status: 'sent',
        },
      });
    } catch (err) {
      console.error('Failed to log contact auto-reply email:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
