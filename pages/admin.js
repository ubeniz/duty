import Head from 'next/head';
import { useEffect, useState } from 'react';


export default function admin() {
    const [talepler, setTalepler] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const taleplerData = await fetchTalepler();
            setTalepler(taleplerData);
        }
        fetchData();
    }, []);

    async function fetchTalepler() {
        try {
            const response = await fetch('/api/talepler');
            const talepler = await response.json();
            return talepler;
        } catch (error) {
            console.error('Talepler alınamadı:', error);
            return [];
        }
    }
    
    async function onaylaTalep(id, dutyDate, withWhom, requester) {
        try {
            const response = await fetch('/api/approveRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, dutyDate, withWhom, requester })
            });
    
            if (response.ok) {
                alert('Talep başarıyla onaylandı.');
                window.location.reload();
            } else {
                alert('Talep onaylanırken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Talep onaylanırken bir hata oluştu:', error);
            alert('Talep onaylanırken bir hata oluştu.');
        }
    }
    function formatDateString(dateString) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dateString).toLocaleString('tr-TR', options);
    }

    function shiftSchedule(currentWeekDuties) {
        const shiftedSchedule = {};

        Object.keys(currentWeekDuties).forEach(date => {
            const duties = currentWeekDuties[date];
            const shiftedDate = shiftDate(date);
            shiftedSchedule[shiftedDate] = duties;
        });

        return shiftedSchedule;
    }

    function shiftDate(inputDate) {
        const parts = inputDate.split('-');
        const date = new Date(parts[2], parts[1] - 1, parts[0]);

        const dayOfWeek = date.getDay();

        let daysToAdd;
        if (dayOfWeek === 1) {
            daysToAdd = 11;
        } else {
            daysToAdd = 6;
        }

        const shiftedDate = new Date(date);
        shiftedDate.setDate(shiftedDate.getDate() + daysToAdd);

        const shiftedDateString = formatDate(shiftedDate);
        return shiftedDateString;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    const sortJson = (EXPECTED_OUTPUT) => {
        const keys = Object.keys(EXPECTED_OUTPUT);
        const firstKey = keys[0];
        const firstValue = EXPECTED_OUTPUT[firstKey];
    
        delete EXPECTED_OUTPUT[firstKey];
        EXPECTED_OUTPUT[firstKey] = firstValue;
        return EXPECTED_OUTPUT;
    }

    const currentWeekDuties = {
        "13-05-2024": ["Üzeyir Orak", "Samet Öçsoy", "Batuhan Özalp", "Sevcan Babatüngüz"],
        "14-05-2024": ["Ümit Beniz", "Berkay Berat Sönmez", "Sefa Kerem Koçakoğlu", "Çağın Güven"],
        "15-05-2024": ["Onur Adıgüzel", "Beyza Kayraklık", "Emin Mustafa"],
        "16-05-2024": ["Deniz Özoğul", "Kerem Küçük", "Doğukan Akgün", "Esra Aka"],
        "17-05-2024": ["Aziz Ocaklı", "Ali Ziya Çevik", "Berkan Taşçı", "Sibel Özdemir"]
    };

    //const EXPECTED_OUTPUT = shiftSchedule(currentWeekDuties);
    // console.log("--------------------------------------------------------------------------------------------------------")
    // console.log(currentWeekDuties);
    // console.log("--------------------------------------------------------------------------------------------------------")
    // console.log(sortJson(EXPECTED_OUTPUT));
    // console.log("--------------------------------------------------------------------------------------------------------")

    return (
        <div>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Yönetici Paneli</title>
                <link rel="icon" type="image/png" href="./favicon.ico" />
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </Head>

            <div className="container">
                <h1 className="text-center my-4">Yönetici Paneli</h1>
                <table id="talepTablosu" className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Talep Tarihi</th>
                            <th>Nöbet Tarihi</th>
                            <th>Talep Eden</th>
                            <th>Kiminle Değiştirecek</th>
                            <th>Onay Durumu</th>
                            <th>Onayla</th>
                        </tr>
                    </thead>
                    <tbody>
                    {talepler.map(talep => (
                        <tr key={talep.id}>
                            <td>{formatDateString(talep.submissionTime)}</td>
                            <td>{talep.dutyDate}</td>
                            <td>{talep.requester}</td>
                            <td>{talep.withWhom}</td>
                            <td>{talep.approve ? <span className="badge badge-success">Onaylandı</span> : <span className="badge badge-warning">Onay Bekliyor</span>}</td>
                            <td>{!talep.approveDate && <button className="btn btn-primary" onClick={() => onaylaTalep(talep.id, talep.dutyDate, talep.withWhom, talep.requester)}>Onayla</button>}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <style>{`
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
        
                .container {
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
        
                th,
                td {
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }
        
                th {
                    background-color: #f2f2f2;
                }
        
                tr:hover {
                    background-color: #f5f5f5;
                }
            `}</style>
        </div>
    );
}
