import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function downloadImage(url: string): Promise<string | null> {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
      timeout: 10000,
    });

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('Invalid content type:', contentType);
      return null;
    }

    const ext = contentType.split('/')[1] || 'jpg';
    const hash = crypto.createHash('md5').update(url).digest('hex');
    const filename = `external-${hash}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const imageUrl = `/uploads/${filename}`;
        resolve(imageUrl);
      });
      writer.on('error', (error) => {
        console.error('Write error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Download image error:', error);
    return null;
  }
}