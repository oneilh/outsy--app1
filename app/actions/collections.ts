'use server'

import fs from 'fs';
import path from 'path';
import { Collection } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const COLLECTIONS_FILE = path.join(process.cwd(), 'data', 'collections.json');

export async function addCollection(collection: Omit<Collection, 'id'>) {
  try {
    const collections: Collection[] = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    
    const newCollection: Collection = {
      ...collection,
      id: Math.random().toString(36).substring(2, 11)
    };
    
    collections.push(newCollection);
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
    
    revalidatePath('/admin');
    revalidatePath('/collections');
    revalidatePath('/');
    return { success: true, collection: newCollection };
  } catch (error) {
    console.error('Failed to add collection:', error);
    return { success: false, error: 'Failed to add collection' };
  }
}

export async function updateCollection(id: string, updates: Partial<Collection>) {
  try {
    const collections: Collection[] = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) return { success: false, error: 'Collection not found' };
    
    collections[index] = { ...collections[index], ...updates };
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
    
    revalidatePath('/admin');
    revalidatePath(`/collections/${collections[index].slug}`);
    revalidatePath('/collections');
    revalidatePath('/');
    return { success: true, collection: collections[index] };
  } catch (error) {
    console.error('Failed to update collection:', error);
    return { success: false, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id: string) {
  try {
    const collections: Collection[] = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    const collectionToDelete = collections.find(c => c.id === id);
    const filtered = collections.filter(c => c.id !== id);
    
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(filtered, null, 2));
    
    revalidatePath('/admin');
    revalidatePath('/collections');
    if (collectionToDelete) {
      revalidatePath(`/collections/${collectionToDelete.slug}`);
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete collection:', error);
    return { success: false, error: 'Failed to delete collection' };
  }
}
