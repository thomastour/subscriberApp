document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/subscribers');
        const subscribers = await response.json();

        // Populate the table with subscribers
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
            const response = await fetch('http://localhost:3000/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, consentToTrack })
            });
            
            const result = await response.json();
            if (response.ok ) {
                // Append the new subscriber to the table
                addSubscriberToTable(name, email); 
            } else {
                alert(result.message || 'Error adding subscriber');
            }
        } catch (error) {
            alert(error.data);
        }
    });

    // Function to delete a subscriber
    async function deleteSubscriber(email, button) {

          // Remove the row 
          const row = button.closest('tr'); 
          row.remove(); 


        if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
        try {
            const response = await fetch(`http://localhost:3000/unsubscribers`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                console.log('Subscriber deleted and removed from UI:', email);
            } else {
                alert('Error deleting subscriber');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Attach event listener to the tbody (parent of all rows)
    document.querySelector('tbody').addEventListener('click', function(e) {
       
        if (e.target && e.target.classList.contains('btn-danger')) { 
            const row = e.target.closest('tr');  
            const email = row.cells[0].textContent;  // Assuming the email is in the first cell
          
            deleteSubscriber(email, e.target);  
        }
    });

    // add a new subscriber 
    function addSubscriberToTable(name, email) {
        const tbody = document.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${email}</td>
            <td>${name}</td>
            <td><button class="btn btn-danger btn-sm">Delete</button></td>
        `;
        // Append the new row to the table
        tbody.appendChild(newRow);
    }

});
