import fs from 'fs/promises';
const nobetListesiDosyaYolu = './data/nobetListesi.json';

export async function updateDuty(date, currentName, newName) {
    try {
        // Nöbet listesini dosyadan oku
        const data = await fs.readFile(nobetListesiDosyaYolu);
        let schedule = JSON.parse(data);

        // Tarih formatını düzenle
        const currentDate = parseCustomDateFormat(date);
        const monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const keyDate = formatDate(monday);

        // Hata mesajları
        const ERROR_MESSAGES = {
            DATE_NOT_FOUND: "Belirtilen tarih bulunamadı.",
            DUTY_PERSON_NOT_FOUND: "Mevcut nöbetçi bulunamadı.",
            GENERIC_ERROR: "Bir hata oluştu."
        };

        // Tarih kontrolü
        if (!schedule[keyDate] || !schedule[keyDate][date]) {
            console.log(ERROR_MESSAGES.DATE_NOT_FOUND);
            return { success: false, message: ERROR_MESSAGES.DATE_NOT_FOUND };
        }

        // Nöbetçi kontrolü
        const dutyList = schedule[keyDate][date];
        if (!dutyList.includes(currentName)) {
            console.log(ERROR_MESSAGES.DUTY_PERSON_NOT_FOUND);
            return { success: false, message: ERROR_MESSAGES.DUTY_PERSON_NOT_FOUND };
        }

        // Nöbetçiyi güncelle
        dutyList[dutyList.indexOf(currentName)] = newName;
        console.log(`Nöbet güncellendi: ${date} tarihinde ${currentName} adlı nöbetçi ${newName} olarak güncellendi.`);

        // Güncellenmiş nöbet listesini dosyaya yaz
        await fs.writeFile(nobetListesiDosyaYolu, JSON.stringify(schedule, null, 2), 'utf8');
        console.log("Nöbet listesi başarıyla güncellendi.");

        return { success: true };
    } catch (error) {
        // Hata durumunda geri dön
        console.error('Bir hata oluştu:', error);
        return { success: false, message: ERROR_MESSAGES.GENERIC_ERROR };
    }
}

function parseCustomDateFormat(dateString) {
    const parts = dateString.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return new Date(formattedDate);
}

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}

// API rotası işleyicisi
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }

    const { date, currentName, newName } = req.query;

    try {
        const result = await updateDuty(date, currentName, newName);
        if (result.success) {
            res.status(200).send('Nöbet başarıyla güncellendi.');
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        console.error('Bir hata oluştu:', error);
        res.status(500).send('Bir hata oluştu.');
    }
}
