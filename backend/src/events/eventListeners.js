// src/events/eventListeners.js
const eventBus = require('./eventBus');

eventBus.on('userRegistered', (user) => {
  console.log(`User registered: ${user.email}`);
  // Additional actions like sending a welcome email can be added here
});

eventBus.on('userLoggedIn', (user) => {
  console.log(`User logged in: ${user.email}`);
  // Actions for user login, such as logging activity
});

eventBus.on('userUpdated', (user) => {
  console.log(`User updated: ${user.email}`);
  // Actions for user update, like notifying user about changes
});

eventBus.on('articlesFetched', (articles) => {
  console.log(`Articles fetched: ${articles.length} articles retrieved.`);
  // Additional actions like caching articles can be performed here
});
