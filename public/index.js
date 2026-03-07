document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/subscribers');
        const subscribers = await response.json();

        subscribers.Results.forEach(subscriber => {
            addSubscriberToTable(subscriber.Name, subscriber.EmailAddress);
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
    }
    

    // Handle form submission for adding subscribers
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault();  

        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const consentToTrack = 'Yes';

        try {
            const response = await fetch('/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, consentToTrack })
            });
            
            const result = await response.json();
            if (response.ok ) {
                addSubscriberToTable(name, email);
                document.querySelector('form').reset();
            } else {
                alert(result.message || 'Error adding subscriber');
            }
        } catch (error) {
            alert('Unable to add subscriber right now.');
        }
    });

    async function deleteSubscriber(email, button) {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            const response = await fetch('/unsubscribers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                const row = button.closest('tr');
                row.remove();
            } else {
                alert('Error deleting subscriber');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.querySelector('tbody').addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.btn-danger');

        if (deleteButton) {
            const row = deleteButton.closest('tr');
            const email = row.cells[0].textContent;

            deleteSubscriber(email, deleteButton);
        }
    });

    function addSubscriberToTable(name, email) {
        const tbody = document.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${email}</td>
            <td>${name}</td>
            <td><button class="btn btn-danger btn-sm">Delete</button></td>
        `;
        tbody.appendChild(newRow);
    }

});
