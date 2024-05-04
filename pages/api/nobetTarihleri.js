// pages/api/nobetTarihleri.js

import fs from 'fs/promises';
const nobetListesiDosyaYolu = './data/nobetListesi.json';

export default async function handler(req, res) {
    try {
        const nobetListesi = await nobetListesiniOku();
        const tarihler = Object.keys(nobetListesi);
        res.status(200).json(tarihler);
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
