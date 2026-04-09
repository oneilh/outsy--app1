'use server'

import fs from 'fs';
import path from 'path';
import { Business } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const BUSINESSES_FILE = path.join(process.cwd(), 'data', 'businesses.json');

export async function addBusiness(business: Omit<Business, 'id'>) {
  try {
    const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf8'));
    
    const newBusiness: Business = {
      ...business,
      id: Math.random().toString(36).substring(2, 11)
    };
    
    businesses.push(newBusiness);
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
    
    revalidatePath('/admin');
    return { success: true, business: newBusiness };
  } catch (error) {
    console.error('Failed to add business:', error);
    return { success: false, error: 'Failed to add business' };
  }
}

export async function updateBusiness(id: string, updates: Partial<Business>) {
  try {
    const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf8'));
    const index = businesses.findIndex(b => b.id === id);
    
    if (index === -1) return { success: false, error: 'Business not found' };
    
    businesses[index] = { ...businesses[index], ...updates };
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
    
    revalidatePath('/admin');
    return { success: true, business: businesses[index] };
  } catch (error) {
    console.error('Failed to update business:', error);
    return { success: false, error: 'Failed to update business' };
  }
}

export async function deleteBusiness(id: string) {
  try {
    const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf8'));
    const filtered = businesses.filter(b => b.id !== id);
    
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(filtered, null, 2));
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete business:', error);
    return { success: false, error: 'Failed to delete business' };
  }
}
