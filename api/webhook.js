// Store per mantenere l'ultimo evento
let lastEvent = null;

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
        // Restituisci l'ultimo evento se disponibile, altrimenti nessun nuovo evento
        if (lastEvent) {
            const event = lastEvent;
            lastEvent = null; // Reset dopo la lettura
            return res.status(200).json(event);
        } else {
            return res.status(204).end(); // No Content - nessun nuovo evento
        }
    }

    if (req.method === 'POST') {
        try {
            // Log delle intestazioni per debug
            console.log('Headers ricevuti:', req.headers);
            console.log('Content-Type:', req.headers['content-type']);
            
            const eventData = req.body;
            console.log('Dati ricevuti (raw):', JSON.stringify(eventData, null, 2));

            // Se non c'è un tipo specificato, assumiamo che sia un boom
            if (!eventData.type) {
                eventData.type = 'boom';
            }

            // Assicuriamoci che i campi necessari esistano
            if (!eventData.advisor) eventData.advisor = 'Advisor';
            if (!eventData.client) eventData.client = eventData.message || 'Cliente';

            // Log dei dati processati
            console.log('Dati processati:', JSON.stringify(eventData, null, 2));

            // Salva l'evento per la prossima richiesta GET
            lastEvent = eventData;

            // Risposta positiva
            return res.status(200).json({
                status: 'success',
                message: 'Evento ricevuto correttamente',
                data: eventData
            });
        } catch (error) {
            console.error('Errore nel processing dei dati:', error);
            return res.status(400).json({
                status: 'error',
                message: 'Errore nel processing dei dati',
                error: error.message
            });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};