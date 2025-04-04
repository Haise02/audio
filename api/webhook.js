module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Return some mock data for testing
        return res.status(200).json({
            type: 'boom',
            message: 'Test event',
            advisor: 'Test Advisor',
            client: 'Test Client'
        });
    }

    if (req.method === 'POST') {
        try {
            const eventData = req.body;
            console.log("Dati ricevuti:", eventData);

            // Verifica che i campi richiesti siano presenti
            if (!eventData.message || !eventData.advisor || !eventData.type) {
                console.log("Errore: Manca un campo richiesto");
                return res.status(400).send('Bad Request: Missing required fields');
            }

            // Risposta positiva
            res.status(200).json(eventData);
        } catch (error) {
            console.error('Errore nel parsing dei dati:', error);
            res.status(400).send('Bad Request: Invalid JSON format');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};