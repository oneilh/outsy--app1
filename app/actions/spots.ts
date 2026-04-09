'use server'

import fs from 'fs';
import path from 'path';
import { Spot } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const SPOTS_FILE = path.join(process.cwd(), 'data', 'spots.json');

export async function addSpot(spot: Omit<Spot, 'id' | 'createdAt' | 'goingNowCount'>) {
  try {
    const spots: Spot[] = JSON.parse(fs.readFileSync(SPOTS_FILE, 'utf8'));
    
    const newSpot: Spot = {
      ...spot,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      goingNowCount: 0
    };
    
    spots.push(newSpot);
    fs.writeFileSync(SPOTS_FILE, JSON.stringify(spots, null, 2));
    
    revalidatePath('/admin');
    revalidatePath('/spots');
    revalidatePath('/');
    return { success: true, spot: newSpot };
  } catch (error) {
    console.error('Failed to add spot:', error);
    return { success: false, error: 'Failed to add spot' };
  }
}

export async function updateSpot(id: string, updates: Partial<Spot>) {
  try {
    const spots: Spot[] = JSON.parse(fs.readFileSync(SPOTS_FILE, 'utf8'));
    const index = spots.findIndex(s => s.id === id);
    
    if (index === -1) return { success: false, error: 'Spot not found' };
    
    spots[index] = { ...spots[index], ...updates };
    fs.writeFileSync(SPOTS_FILE, JSON.stringify(spots, null, 2));
    
    revalidatePath('/admin');
    revalidatePath(`/spots/${spots[index].slug}`);
    revalidatePath('/spots');
    revalidatePath('/');
    return { success: true, spot: spots[index] };
  } catch (error) {
    console.error('Failed to update spot:', error);
    return { success: false, error: 'Failed to update spot' };
  }
}

export async function verifySpot(id: string) {
  try {
    const spots: Spot[] = JSON.parse(fs.readFileSync(SPOTS_FILE, 'utf8'));
    const index = spots.findIndex(s => s.id === id);
    
    if (index === -1) return { success: false, error: 'Spot not found' };
    
    spots[index].isVerified = true;
    spots[index].lastVerifiedDate = new Date().toISOString().split('T')[0];
    
    fs.writeFileSync(SPOTS_FILE, JSON.stringify(spots, null, 2));
    
    revalidatePath('/admin');
    revalidatePath(`/spots/${spots[index].slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to verify spot:', error);
    return { success: false, error: 'Failed to verify spot' };
  }
}

export async function deleteSpot(id: string) {
  try {
    const spots: Spot[] = JSON.parse(fs.readFileSync(SPOTS_FILE, 'utf8'));
    const spotToDelete = spots.find(s => s.id === id);
    const filtered = spots.filter(s => s.id !== id);
    
    fs.writeFileSync(SPOTS_FILE, JSON.stringify(filtered, null, 2));
    
    revalidatePath('/admin');
    revalidatePath('/spots');
    if (spotToDelete) {
      revalidatePath(`/spots/${spotToDelete.slug}`);
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete spot:', error);
    return { success: false, error: 'Failed to delete spot' };
  }
}
