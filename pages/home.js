import Head from 'next/head';
import { useEffect,useState } from 'react';

export default function Home() {
    useEffect(() => {
        InitializeMethods();
    }, []);

    const submitRequest = async () => {
        const weekKey = document.getElementById('weekSelector').value;
        const dutyDate = document.getElementById('dutyDate').value;
        const withWhom = document.getElementById('withWhom').value;
        const requester = document.getElementById('requester').value;
        const submissionData = {
            weekKey,
            dutyDate,
            withWhom,
            requester,
        };

        try {
            const response = await fetch('/api/submitRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                alert('Nöbet değişim talebi başarıyla gönderildi.');
                location.reload()
            } else {
                alert('Talep gönderilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Talep gönderilirken bir hata oluştu:', error);
            alert('Talep gönderilirken bir hata oluştu.');
        }
    };

    const handleWeekChange = () => {
        const selectedWeekKey = document.getElementById('weekSelector').value;
        populateDateSelector(selectedWeekKey);
    };

    const handleDutyDateChange = () => {
        populateDutyPersons();
    };

    const handleRequestButtonClick = () => {
        populateWeekSelector();
        populatePersonInputs();
    };

    const populateWeekSelector = () => {
        const weekSelector = document.getElementById("weekSelector");

        const thisWeekKey = document.getElementById("current").getAttribute("data-week-key");
        const nextWeekKey = document.getElementById("next").getAttribute("data-week-key");

        const thisWeekOption = new Option(`Bu Hafta (${thisWeekKey})`, thisWeekKey);
        thisWeekOption.dataset.weekKey = thisWeekKey;
        weekSelector.appendChild(thisWeekOption);

        const nextWeekOption = new Option(`Gelecek Hafta (${nextWeekKey})`, nextWeekKey);
        nextWeekOption.dataset.weekKey = nextWeekKey;
        weekSelector.appendChild(nextWeekOption);
    }

    const populatePersonInputs = () => {
        const requesterSelect = document.getElementById('requester');
        $.get('/api/kisiler', function (data) {
            data.forEach(function (person) {
                const option = document.createElement('option');
                option.value = person;
                option.textContent = person;
                requesterSelect.appendChild(option);
            });
        });
    };

    const populateDateSelector = (selectedWeekKey) => {
        const dateSelector = document.getElementById('dutyDate');

        fetch(`/api/nobetListesi/${selectedWeekKey}`)
            .then((response) => response.json())
            .then((data) => {
                dateSelector.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.disabled = true;
                defaultOption.selected = true;
                defaultOption.value = '';
                defaultOption.textContent = 'Lütfen bir tarih seçiniz...';
                dateSelector.appendChild(defaultOption);

                for (const date in data) {
                    const option = document.createElement('option');
                    option.value = date;
                    option.textContent = date;
                    dateSelector.appendChild(option);
                }
            })
            .catch((error) => console.error('Hata:', error));
    };

    const populateDutyPersons = () => {
        const weekKey = document.getElementById('weekSelector').value;
        const dutyDate = document.getElementById('dutyDate').value;
        const withWhomSelect = document.getElementById('withWhom');

        fetch(`/api/getDutyPersons?weekKey=${weekKey}&dutyDate=${dutyDate}`)
            .then((response) => response.json())
            .then((data) => {
                withWhomSelect.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.disabled = true;
                defaultOption.selected = true;
                defaultOption.value = '';
                defaultOption.textContent = 'Seçiniz...';
                withWhomSelect.appendChild(defaultOption);

                data.forEach((person) => {
                    const option = document.createElement('option');
                    option.value = person;
                    option.textContent = person;
                    withWhomSelect.appendChild(option);
                });
            })
            .catch((error) => console.error('Hata:', error));
    };

    const InitializeMethods = () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);

        getWeeklyDutyList(monday, 'current');

        const nextWeekStartDate = new Date(monday);
        nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
        getWeeklyDutyList(nextWeekStartDate, 'next');

        clearFormFields();
    };

    const getWeeklyDutyList = (startDate, containerId) => {
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        const formattedStartDate = formatDate(startDate);
        const apiPath = `http://${currentHost}:${currentPort}/api/nobetListesi/${formattedStartDate}`;

        fetch(apiPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Sunucudan geçerli bir yanıt alınamadı');
                }
                return response.json();
            })
            .then((data) => {
                const container = document.getElementById(containerId);
                container.setAttribute('data-week-key', formattedStartDate);

                Object.keys(data).forEach((day) => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const cardHeader = document.createElement('div');
                    cardHeader.classList.add('card-header');
                    let dayName = getDayName(day);
                    let customDate = getCustomDate(day);
                    cardHeader.textContent = `${customDate}, ${dayName}`;
                    cardHeader.setAttribute('data-day-key', day);
                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const listGroup = document.createElement('ul');
                    listGroup.classList.add('list-group');
                    listGroup.classList.add('list-group-flush');

                    data[day].forEach((person) => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('list-group-item');
                        listItem.textContent = person;
                        listGroup.appendChild(listItem);
                    });
                    cardBody.appendChild(listGroup);
                    card.appendChild(cardHeader);
                    card.appendChild(cardBody);
                    container.appendChild(card);
                });
            })
            .catch((error) => console.error('Hata:', error));
    };

    const formatDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const getCustomDate = (input) => {
        const dateParts = input.split('-');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = parseInt(dateParts[2]);

        const monthNames = [
            'Ocak', 'Şubat', 'Mart',
            'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
            'Ağustos', 'Eylül', 'Ekim',
            'Kasım', 'Aralık'
        ];

        return `${day} ${monthNames[month - 1]} ${year}`;
    };

    const getDayName = (dateString) => {
        const parts = dateString.split('-');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month - 1, day);

        const options = { weekday: 'long' };
        return new Intl.DateTimeFormat('tr-TR', options).format(date);
    };

    const clearFormFields = () => {
        document.getElementById('weekSelector').selectedIndex = 0;
        document.getElementById('dutyDate').selectedIndex = 0;
        document.getElementById('withWhom').selectedIndex = 0;
        document.getElementById('requester').selectedIndex = 0;
    };

    return (
        <div>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Haftalık Nöbet Listesi</title>
                <link rel="icon" type="image/png" href="favicon.ico" />
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </Head>

            <header>
                <div id="header">
                    <button onClick={handleRequestButtonClick} className="btn btn-primary btn-sm" id="changeRequestButton" data-toggle="modal" data-target="#changeRequestModal">Nöbet Değişim Talebi</button>
                    <span>Geliştirme talepleri veya hata bildirimi için → <a href="mailto:aaa@bbb.com.tr">aaa@bbb.com.tr</a></span>
                    <span id="version">v1.0.0</span>
                </div>
            </header>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2 className="mt-3 mb-3">Bu Haftanın Nöbet Listesi</h2>
                        <div id="current"></div>
                    </div>
                    <div className="col">
                        <h2 className="mt-3 mb-3">Gelecek Haftanın Nöbet Listesi</h2>
                        <div id="next"></div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="changeRequestModal" tabIndex="-1" role="dialog" aria-labelledby="changeRequestModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="changeRequestModalLabel">Nöbet Değişim Talebi</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="weekSelector">Nöbet Haftası Seçer misin?</label>
                                <select className="form-control" id="weekSelector" onChange={handleWeekChange}>
                                    <option value="" disabled>Lütfen bir hafta seçiniz...</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dutyDate">İstediğin Nöbet Tarihi Nedir?</label>
                                <select className="form-control" id="dutyDate" onChange={handleDutyDateChange}>
                                    <option value="" disabled>Lütfen bir tarih seçiniz...</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="withWhom">Kiminle Nöbet Değişeceksin?</label>
                                <select className="form-control" id="withWhom">
                                    <option value="" disabled>Seçiniz...</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="requester">Sen Kimsin?</label>
                                <select className="form-control" id="requester">
                                    <option value="" disabled>Seçiniz...</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-primary" onClick={submitRequest}>Gönder</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                body {
                    background-color: #e0e0e0 !important;
                }

                .container {
                    margin: 0px auto;
                    padding: 50px 0px 0px;
                }

                .card {
                    margin-bottom: 20px;
                }

                .card-header {
                    background-color: #007bff;
                    background: linear-gradient(45deg, #007bff, #e00713);
                    color: #fff;
                    text-align: center;
                }

                .card-body {
                    padding: 0;
                }

                .list-group-item {
                    background-color: #f8f9fa;
                }

                .list-group-item:first-child {
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }

                .list-group-item:last-child {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }

                #header {
                    position: fixed;
                    top: 0;
                    z-index: 100;
                    width: 100%;
                    background-color: #f1f1f1;
                    text-align: center;
                    padding: 10px;
                }

                #changeRequestButton {
                    float: left;
                    margin-left: 20px;
                }

                #version {
                    float: right;
                    margin-right: 20px;
                }
            `}</style>
        </div>
    );
}
