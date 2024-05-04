// pages/api/nobetListesi/[hafta].js

import fs from 'fs/promises';
import path from 'path';

const nobetListesiDosyaYolu = path.resolve(process.cwd(), './data/nobetListesi.json');

async function nobetListesiniOku() {
    try {
        const data = await fs.readFile(nobetListesiDosyaYolu);
        return JSON.parse(data);
    } catch (error) {
        console.error('Nöbet listesi okunamadı:', error);
        return {};
    }
}

export default async function handler(req, res) {
    const { hafta } = req.query;
    try {
        const nobetListesi = await nobetListesiniOku();
        if (nobetListesi[hafta]) {
            res.status(200).json(nobetListesi[hafta]);
        } else {
            res.status(404).send('Belirtilen haftaya ait nöbet listesi bulunamadı.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}
