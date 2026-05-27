import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// Mock email templates — these would be stored in a dedicated model in production
const mockTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to TestCEFR!',
    body: 'Hello {{name}},\n\nWelcome to TestCEFR! We\'re excited to help you on your English learning journey.\n\nYour current level: {{level}}\n\nGet started by taking your first assessment!\n\nBest regards,\nThe TestCEFR Team',
    lastEdited: '2025-03-15',
    usedCount: 87,
    variables: ['name', 'level'],
  },
  {
    id: '2',
    name: 'Certificate Issued',
    subject: 'Your CEFR Certificate is Ready',
    body: 'Congratulations {{name}}!\n\nYou have successfully completed the CEFR assessment and achieved level {{level}}.\n\nYou can view and download your certificate here: {{certificate_url}}\n\nShare your achievement with the world!\n\nBest regards,\nThe TestCEFR Team',
    lastEdited: '2025-03-10',
    usedCount: 5,
    variables: ['name', 'level', 'certificate_url'],
  },
  {
    id: '3',
    name: 'Payment Confirmation',
    subject: 'Payment Received - {{plan}} Plan',
    body: 'Hello {{name}},\n\nThank you for your payment of ${{amount}} for the {{plan}} plan.\n\nYour account has been upgraded and you now have access to all premium features.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nThe TestCEFR Team',
    lastEdited: '2025-03-08',
    usedCount: 42,
    variables: ['name', 'amount', 'plan'],
  },
  {
    id: '4',
    name: 'Assessment Reminder',
    subject: 'Complete Your CEFR Assessment',
    body: 'Hi {{name}},\n\nYou started a CEFR assessment but haven\'t completed it yet.\n\nDon\'t lose your progress! Click below to continue:\n{{assessment_url}}\n\nYour progress will be saved for 24 hours.\n\nBest regards,\nThe TestCEFR Team',
    lastEdited: '2025-02-28',
    usedCount: 156,
    variables: ['name', 'assessment_url'],
  },
  {
    id: '5',
    name: 'Plan Upgrade',
    subject: 'Upgrade Your Plan for More Features',
    body: 'Hi {{name}},\n\nYou\'ve been making great progress on TestCEFR!\n\nUnlock even more features by upgrading to our {{plan}} plan:\n- Unlimited assessments\n- Priority support\n- Certificate downloads\n\nUpgrade now: {{upgrade_url}}\n\nBest regards,\nThe TestCEFR Team',
    lastEdited: '2025-02-15',
    usedCount: 234,
    variables: ['name', 'plan', 'upgrade_url'],
  },
];

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    return NextResponse.json({
      templates: mockTemplates,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Email Templates API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
