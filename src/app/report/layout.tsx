// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
