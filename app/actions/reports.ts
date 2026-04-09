'use server'

import fs from 'fs';
import path from 'path';
import { IssueReport } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

export async function submitReport(formData: {
  spotId?: string;
  spotName?: string;
  issueType: IssueReport['issueType'];
  description: string;
  email?: string;
}) {
  try {
    const reports: IssueReport[] = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
    
    const newReport: IssueReport = {
      id: Math.random().toString(36).substring(2, 11),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    reports.push(newReport);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
    
    revalidatePath('/'); // Or specific paths if needed
    return { success: true };
  } catch (error) {
    console.error('Failed to submit report:', error);
    return { success: false, error: 'Failed to submit report' };
  }
}
