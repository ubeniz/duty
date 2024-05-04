// pages/api/getDutyPersons.js

import fs from 'fs/promises';
const nobetListesiDosyaYolu = './data/nobetListesi.json';

export default async function handler(req, res) {
    try {
        const weekKey = req.query.weekKey;
        const dutyDate = req.query.dutyDate;
        const nobetListesi = await nobetListesiniOku();

        if (nobetListesi[weekKey] && nobetListesi[weekKey][dutyDate]) {
            res.json(nobetListesi[weekKey][dutyDate]);
        } else {
            res.status(404).send('Belirtilen hafta ve tarih için uygun kişiler bulunamadı.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function nobetListesiniOku() {
    try {
        const data = await fs.readFile(nobetListesiDosyaYolu);
        return JSON.parse(data);
    } catch (error) {
        console.error('Nöbet listesi okunamadı:', error);
        return {};
    }
}
