import AppError from '../utils/AppError.js';

const auth = () => `Basic ${Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`;

export async function uploadImage(file, folder = '/the-gifter') {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) throw new AppError('Image service is not configured', 503);
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('fileName', `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`);
  form.append('folder', folder);
  form.append('useUniqueFileName', 'true');
  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', headers: { Authorization: auth() }, body: form });
  const data = await response.json();
  if (!response.ok) throw new AppError(data.message || 'Image upload failed', 502);
  return { url: data.url, fileId: data.fileId };
}

export async function deleteImage(fileId) {
  if (!fileId || !process.env.IMAGEKIT_PRIVATE_KEY) return;
  const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, { method: 'DELETE', headers: { Authorization: auth() } });
  if (!response.ok && response.status !== 404) throw new AppError('Image deletion failed', 502);
}
