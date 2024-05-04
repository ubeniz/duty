// pages/api/submitRequest.js

import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
const taleplerDosyaYolu = './data/talepler.json';

export default async function handler(req, res) {
    try {
        const { weekKey, dutyDate, withWhom, requester } = req.body;

        if (!weekKey || !dutyDate || !withWhom || !requester) {
            throw new Error('Talep gönderilirken gerekli veriler eksik.');
        }

        const newRequest = {
            id: uuidv4(),
            weekKey,
            dutyDate,
            withWhom,
            requester,
            submissionTime: new Date().toISOString(),
            approve: false
        };

        const existingRequests = await readTalepler();
        existingRequests.push(newRequest);
        await fs.writeFile(taleplerDosyaYolu, JSON.stringify(existingRequests, null, 2), 'utf8');
        res.status(200).send('Nöbet değişim talebi başarıyla kaydedildi.');
    } catch (error) {
        console.error('Talep gönderilirken bir hata oluştu:', error);
        res.status(500).send('Talep gönderilirken bir hata oluştu.');
    }
}

async function readTalepler() {
    try {
        const data = await fs.readFile(taleplerDosyaYolu);
        return JSON.parse(data);
    } catch (error) {
        console.error('Talepler okunurken bir hata oluştu:', error);
        return [];
    }
}