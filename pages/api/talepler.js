import fs from 'fs/promises';
const taleplerDosyaYolu = './data/talepler.json';

export default async function handler(req, res) {
    try {
        const talepler = await fs.readFile(taleplerDosyaYolu);
        if (talepler.toString().length > 0)
            res.json(JSON.parse(talepler));
        else
            res.json(null);
    } catch (error) {
        console.error('Talepler alınamadı:', error);
        res.status(500).send('Talepler alınamadı.');
    }
}