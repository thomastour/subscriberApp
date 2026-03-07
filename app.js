const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const listId = process.env.CAMPAIGN_MONITOR_LIST_ID;
const API_KEY = process.env.API_KEY;
const API_BASE_URL = 'https://api.createsend.com/api/v3.3';

function getApiHeaders() {
    if (!API_KEY || !listId) {
        return null;
    }

    return {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
    };
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/subscribers', async (req, res) => {
    const headers = getApiHeaders();
    if (!headers) {
        return res.status(500).json({ message: 'Campaign Monitor credentials are missing.' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/lists/${listId}/active.json`, {
            headers,
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ message: 'Error fetching subscribers' });
    }
});



app.post('/subscribers', async (req, res) => {
    const { email, name, consentToTrack } = req.body;
    const headers = getApiHeaders();

    if (!headers) {
        return res.status(500).json({ message: 'Campaign Monitor credentials are missing.' });
    }

    if (!email || !name) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/subscribers/${listId}.json`,
            {
                EmailAddress: email,
                Name: name,
                ConsentToTrack: consentToTrack  
            },
            {
                headers,
            }
        );

        res.json({ message: 'Subscriber added successfully', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.delete('/unsubscribers', async (req, res) => {
    const { email } = req.body;
    const headers = getApiHeaders();

    if (!headers) {
        return res.status(500).json({ message: 'Campaign Monitor credentials are missing.' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/subscribers/${listId}.json`, {
            headers,
            params: { email },
        });

        if (response.status === 204) {
            return res.json({ message: 'Subscriber deleted successfully' });
        }

        return res.status(502).json({ message: 'Unexpected response from Campaign Monitor.' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting subscriber',
            error: error.message,
        });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
