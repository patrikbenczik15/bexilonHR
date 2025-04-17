const bazaDeDate = [
    { nume: 'Seba', varsta: 10, id: "1" },
    { nume: 'Seba1', varsta: 101, id: "2" },
    { nume: 'Seba3', varsta: 103, id: "3" }
];

class UserService {
    /**
     * Retrieves a user by their ID.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Object|null} - The user object if found, otherwise null.
     */
    static getUserById(id) {
        return bazaDeDate.find(user => user.id === id);
    }

    /**
     * Adds a new user to the database.
     * @param {Object} userModel - The user object to add.
     */
    static createUser(userModel) {
        bazaDeDate.push(userModel);
    }

    /**
     * Updates an existing user by their ID.
     * @param {string} id - The ID of the user to update.
     * @param {Object} userModel - The updated user data.
     * @returns {Object|null} - The updated user object if successful, otherwise null.
     */
    static updateUser(id, userModel) {
        const userIndex = bazaDeDate.findIndex(user => user.id === id);
        if (userIndex === -1) return null;
        bazaDeDate[userIndex] = { ...bazaDeDate[userIndex], ...userModel };
        return bazaDeDate[userIndex];
    }

    /**
     * Deletes a user by their ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Object|null} - The deleted user object if successful, otherwise null.
     */
    static deleteUser(id) {
        const userIndex = bazaDeDate.findIndex(user => user.id === id);
        if (userIndex === -1) return null;
        return bazaDeDate.splice(userIndex, 1)[0];
    }
}

export default UserService;
