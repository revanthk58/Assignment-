// Function to fetch all users
async function fetchAllUsers() {
    try {
      // Fetch data from the API for all users
      const response = await fetch('http://localhost:3000/contacts');
      const users = await response.json();  // Parse JSON response
  
      // Check if any users are available
      if (users.length === 0) {
        document.getElementById("users-list").innerHTML = '<p class="no-users">No users found in the system.</p>';
        return;
      }
  
      // Loop through the users and display each one as a card
      const usersList = document.getElementById("users-list");
      usersList.innerHTML = ''; // Clear previous content
      users.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("card");
  
        // Fill the card with user data
        userCard.innerHTML = `
          <h2>${user.Name}</h2>
          <p><span>Email:</span> ${user.Email}</p>
          <p><span>Phone:</span> ${user.PhoneNumber}</p>
          <p><span>Address:</span> ${user.Address || 'N/A'}</p>
          <p><span>Created At:</span> ${new Date(user.CreatedAt).toLocaleString()}</p>
        `;
  
        // Append the card to the users list
        usersList.appendChild(userCard);
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      document.getElementById("users-list").innerHTML = '<p class="no-users">Failed to load users. Please try again later.</p>';
    }
  }
  
  // Function to fetch a single user by ContactID
  async function fetchSingleUser(contactID) {
    try {
      // Fetch data from the API for a specific user by ContactID
      const response = await fetch(`http://localhost:3000/contacts/${contactID}`);
      const user = await response.json();  // Parse JSON response
  
      // Check if the user exists
      if (!user) {
        document.getElementById("users-list").innerHTML = '<p class="no-users">User not found.</p>';
        return;
      }
  
      // Create a single user card and display the data
      const usersList = document.getElementById("users-list");
      usersList.innerHTML = ''; // Clear previous content
  
      const userCard = document.createElement("div");
      userCard.classList.add("card");
  
      // Fill the card with user data
      userCard.innerHTML = `
        <h2>${user.Name}</h2>
        <p><span>Email:</span> ${user.Email}</p>
        <p><span>Phone:</span> ${user.PhoneNumber}</p>
        <p><span>Address:</span> ${user.Address || 'N/A'}</p>
        <p><span>Created At:</span> ${new Date(user.CreatedAt).toLocaleString()}</p>
      `;
  
      // Append the card to the users list
      usersList.appendChild(userCard);
    } catch (error) {
      console.error('Error fetching user data:', error);
      document.getElementById("users-list").innerHTML = '<p class="no-users">Failed to load the user. Please try again later.</p>';
    }
  }
  
  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Example: Fetch all users (you can call fetchSingleUser with a ContactID when needed)
    fetchAllUsers();
  
    // If you want to fetch a specific user, for example with ContactID 1:
    // fetchSingleUser(1);
  });
  