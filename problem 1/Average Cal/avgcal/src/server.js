// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const BASE_URL = "http://20.244.56.144/test/";
const NUMBER_TYPES = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
};
let numbersWindow = [];

const fetchNumbers = async (numberType) => {
    try {
        const response = await axios.get(`${BASE_URL}${numberType}`, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
};

const updateWindow = (newNumbers) => {
    newNumbers = newNumbers.filter(num => !numbersWindow.includes(num));
    if (numbersWindow.length + newNumbers.length > WINDOW_SIZE) {
        numbersWindow = numbersWindow.slice(newNumbers.length);
    }
    numbersWindow = [...numbersWindow, ...newNumbers];
};

const calculateAverage = () => {
    if (numbersWindow.length === 0) {
        return 0.0;
    }
    return numbersWindow.reduce((acc, num) => acc + num, 0) / numbersWindow.length;
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    if (!NUMBER_TYPES[numberid]) {
        return res.status(400).json({ detail: "Invalid number ID" });
    }

    const numberType = NUMBER_TYPES[numberid];
    const prevState = [...numbersWindow];
    const newNumbers = await fetchNumbers(numberType);
    updateWindow(newNumbers);
    const currState = [...numbersWindow];
    const avg = calculateAverage();

    res.json({
        windowPrevState: prevState,
        windowCurrState: currState,
        numbers: newNumbers,
        avg: avg.toFixed(2)
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
