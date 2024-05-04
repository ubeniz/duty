import fs from 'fs';
const taleplerDosyaYolu = './data/talepler.json';
import { updateDuty } from './updateDuty';

export default async function handler(req, res) {
    try {
        const { id, dutyDate, withWhom, requester } = req.body;

        const talepler = JSON.parse(await fs.promises.readFile(taleplerDosyaYolu));
        const talepIndex = talepler.findIndex(talep => talep.id === id);
        if (talepIndex !== -1) {
            talepler[talepIndex].approve = true;
            talepler[talepIndex].approveDate = new Date().toISOString();

            fs.writeFileSync(taleplerDosyaYolu, JSON.stringify(talepler, null, 2));
            await updateDuty(dutyDate, withWhom, requester);
            res.status(200).send('Talep başarıyla onaylandı.');
        } else {
            res.status(404).send('Talep bulunamadı.');
        }
    } catch (error) {
        console.error('Talep onaylanırken bir hata oluştu:', error);
        res.status(500).send('Talep onaylanırken bir hata oluştu.');
    }
}
