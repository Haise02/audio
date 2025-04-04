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
            const eventData = req.body;
            console.log("Dati ricevuti:", eventData);

            // Verifica che i campi richiesti siano presenti
            if (!eventData.type || !eventData.advisor || 
                (eventData.type === 'boom' && !eventData.client) || 
                (eventData.type === 'appointment' && (!eventData.user || !eventData.advisor)) || 
                (eventData.type === 'lead' && !eventData.user)) {
                console.log("Errore: Manca un campo richiesto");
                return res.status(400).send('Bad Request: Missing required fields');
            }

            // Salva l'evento per la prossima richiesta GET
            lastEvent = eventData;

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