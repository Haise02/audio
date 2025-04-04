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
        // Restituisci l'ultimo evento se disponibile
        if (lastEvent) {
            const event = lastEvent;
            lastEvent = null; // Reset dopo la lettura
            return res.status(200).json(event);
        } else {
            return res.status(204).end(); // No Content
        }
    }

    if (req.method === 'POST') {
        try {
            const eventData = req.body;
            console.log('Dati ricevuti:', eventData);

            // Crea l'evento boom
            const boomEvent = {
                type: 'boom',
                client: eventData.message || 'Cliente',
                advisor: 'Advisor'
            };

            // Salva l'evento per la prossima richiesta GET
            lastEvent = boomEvent;
            console.log('Evento salvato:', boomEvent);

            return res.status(200).json(boomEvent);
        } catch (error) {
            console.error('Errore:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    res.status(405).send('Method Not Allowed');
};