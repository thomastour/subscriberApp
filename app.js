const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors'); 
const port = 3000;

dotenv.config();
app.use(cors());  
app.use(express.json());

// Set up API 
const listId = '35b574407bc15650e519874203cffdc5';  
const API_KEY = process.env.API_KEY;  
const API_BASE_URL = 'https://api.createsend.com/api/v3.3';
//Base64 encode the API Key for Basic Auth
const apiKeyBase64 = Buffer.from(`${API_KEY}:`).toString('base64');   


app.get('/subscribers', async (req, res) => {
    try {
        
        const response = await axios.get(`${API_BASE_URL}/lists/${listId}/active.json`,
             {
            headers: {
                Authorization: `Basic ${apiKeyBase64}`,  
                'Content-Type': 'application/json',
            }
        });

        // Respond with the list of subscribers
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ message: 'Error fetching subscribers' });
    }
});



// POST route for adding subscribers
app.post('/subscribers', async (req, res) => {
    const { email, name, consentToTrack } = req.body;

    try {
        // Send the request to add a new subscriber
        const response = await axios.post(
            `${API_BASE_URL}/subscribers/${listId}.json`,
            {
                EmailAddress: email,
                Name: name,
                ConsentToTrack: consentToTrack  
            },
            {
                headers: {
                    Authorization: `Basic ${apiKeyBase64}`,  
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ message: 'Subscriber added successfully', data: response.data });
    } catch (error) {
        
        res.status(500).json({ message: 'Internal Server Error', error: error.message });

    }
});

    // Delete route for removing subs
    app.delete('/unsubscribers', async (req, res) => {
        const {email} = req.body;

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/subscribers/${listId}.json?email=${email}`,
                {
                    headers: {
                        Authorization: `Basic ${apiKeyBase64}`,  
                        'Content-Type': 'application/json',
                    },
                }
                
            );
             if (response.status === 204) {
                 res.json({ message: 'Subscriber deleted successfull'})
                 }

        } catch (error) {
            res.status(500).json ({
                message: 'Error deleting subscriber'
            });
        }
    });



// // Test route for verifying the server is running
// app.post('/test', (req, res) => {
//     res.json({ message: "Test route working" });
// });



app.listen(port, () => console.log(`Server running on port ${port}`));
