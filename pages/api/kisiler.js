import fs from 'fs/promises';

const kisiListesiDosyaYolu = './data/kisiListesi2.json';

export default async function handler(req, res) {
    try {
        const kisiListesi = await kisiListesiniOku();
        res.status(200).json(kisiListesi.Kisiler);
    } catch (error) {
        console.error('Kişi listesi alınamadı:', error);
        res.status(500).send('Kişi listesi alınamadı.');
    }
}

async function kisiListesiniOku() {
    try {
        const data = await fs.readFile(kisiListesiDosyaYolu);
        return JSON.parse(data);
    } catch (error) {
        console.error('Kişi listesi okunamadı:', error);
        return {};
    }
}