'use server'

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const TAGS_FILE = path.join(process.cwd(), 'data', 'tags.json');

export async function addTag(tag: string) {
  try {
    const tags: string[] = JSON.parse(fs.readFileSync(TAGS_FILE, 'utf8'));
    if (!tags.includes(tag)) {
      tags.push(tag);
      fs.writeFileSync(TAGS_FILE, JSON.stringify(tags.sort(), null, 2));
    }
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add tag' };
  }
}

export async function deleteTag(tag: string) {
  try {
    const tags: string[] = JSON.parse(fs.readFileSync(TAGS_FILE, 'utf8'));
    const filtered = tags.filter(t => t !== tag);
    fs.writeFileSync(TAGS_FILE, JSON.stringify(filtered, null, 2));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete tag' };
  }
}
