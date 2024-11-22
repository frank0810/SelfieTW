export const fetchUserNotes = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/user/getUserData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const noteIds = result.user.userNotes || [];

        const notePromises = noteIds.map(async (id) => {
            const noteResponse = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!noteResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const note = await noteResponse.json();
            return note.note;
        });

        return await Promise.all(notePromises);
    } catch (error) {
        console.error('Errore durante il fetch delle note:', error);
        throw error;
    }
};

export const fetchUserEvents = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/user/getUserData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const eventIDs = result.user.userEvents || [];

        const eventPromises = eventIDs.map(async (id) => {
            const eventResponse = await fetch(`http://localhost:3000/events/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!eventResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const event = await eventResponse.json();
            return event.event;
        });

        return await Promise.all(eventPromises);
    } catch (error) {
        console.error('Errore durante il fetch degli eventi:', error);
        throw error;
    }
};