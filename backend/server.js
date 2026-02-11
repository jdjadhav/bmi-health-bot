const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;
const ML_SERVICE_URL = 'http://localhost:5000/predict';

app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle BMI calculation requests
app.use(express.static('../frontend'));

app.post('/api/calculate-bmi', async (req, res) => {
    try {
        const { height, weight } = req.body;

        if (!height || !weight) {
            return res.status(400).json({ error: 'Height and weight are required' });
        }

        // Call ML service
        const response = await axios.post(ML_SERVICE_URL, {
            height: parseFloat(height),
            weight: parseFloat(weight)
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error calling ML service:', error.message);
        res.status(500).json({ error: 'Failed to calculate BMI' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
