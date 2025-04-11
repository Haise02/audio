// Store per mantenere gli ultimi eventi per tipo
let lastEvents = {
    boom: null,
    appointment: null,
    lead: null
};

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
        // Controlla se ci sono nuovi eventi
        const events = Object.values(lastEvents).filter(event => event !== null);
        
        if (events.length > 0) {
            // Prendi il primo evento disponibile
            const event = events[0];
            // Resetta quell'evento specifico
            lastEvents[event.type] = null;
            return res.status(200).json(event);
        } else {
            return res.status(204).end(); // No Content
        }
    }

    if (req.method === 'POST') {
        try {
            const eventData = req.body;
            console.log('Dati ricevuti:', eventData);

            // Determina il tipo di evento dal payload
            const eventType = eventData.type || 'boom'; // default a boom per retrocompatibilità
            
            // Pulisci il messaggio rimuovendo URL e caratteri speciali
            let cleanMessage = eventData.message || eventData.client || 'Cliente';
            // Rimuovi URL
            cleanMessage = cleanMessage.replace(/https?:\/\/[^\s]+/g, '').trim();
            // Rimuovi caratteri speciali e righe vuote
            cleanMessage = cleanMessage.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('_') && !line.endsWith('_'))
                .join(' ')
                .trim();
            
            // Crea l'evento con il tipo appropriato
            const newEvent = {
                type: eventType,
                client: cleanMessage
            };
            
            // Aggiungi advisor solo se presente
            if (eventData.advisor) {
                newEvent.advisor = eventData.advisor;
            }
            
            console.log('Messaggio pulito:', cleanMessage);

            // Salva l'evento nel tipo appropriato
            lastEvents[eventType] = newEvent;
            console.log('Evento salvato:', newEvent);

            return res.status(200).json(newEvent);
        } catch (error) {
            console.error('Errore:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    res.status(405).send('Method Not Allowed');
};