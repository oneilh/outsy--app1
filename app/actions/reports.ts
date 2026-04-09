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

export async function updateReportStatus(reportId: string, status: IssueReport['status']) {
  try {
    const reports: IssueReport[] = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
    const index = reports.findIndex(r => r.id === reportId);
    
    if (index === -1) return { success: false, error: 'Report not found' };
    
    reports[index].status = status;
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update report status:', error);
    return { success: false, error: 'Failed to update report status' };
  }
}

export async function deleteReport(reportId: string) {
  try {
    const reports: IssueReport[] = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
    const filtered = reports.filter(r => r.id !== reportId);
    
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(filtered, null, 2));
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete report:', error);
    return { success: false, error: 'Failed to delete report' };
  }
}
