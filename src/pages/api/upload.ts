// pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // ทำการจัดการการอัพโหลดไฟล์ที่นี่
    const data = req.body; // หากใช้ form-data ให้ใช้ req.body
    console.log(data); // ตัวอย่างการแสดงข้อมูลที่อัพโหลด
    res.status(200).json({ message: 'อัพโหลดไฟล์สำเร็จ' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
