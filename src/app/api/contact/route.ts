import { NextRequest, NextResponse } from 'next/server';
import { sendContactAutoReply, sendAdminEmail, emailShell } from '@/lib/email';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    // Send admin notification
    const orgLine = organizationName
      ? `<div class="detail-row"><span class="detail-label">Organization</span><span class="detail-value">${organizationName}</span></div>`
      : '';

    await sendAdminEmail(
      `New Contact Form Submission from ${name}`,
      emailShell('New Contact Submission',
        `<div class="content">
          <p class="greeting">New contact form submission</p>
          <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${name}</span></div>
          <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${email}</span></div>
          <div class="detail-row"><span class="detail-label">Account Type</span><span class="detail-value">${typeLabel}</span></div>
          ${orgLine}
          <hr class="divider" />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</p>
        </div>`),
      'contact_notification'
    );

    // Log the auto-reply email as well
    try {
      await db.emailLog.create({
        data: {
          to: email,
          from: 'TestCEFR <noreply@testcefr.com>',
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
