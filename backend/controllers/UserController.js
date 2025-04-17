import UserService from '../services/UserService.js';

class UserController {
    /**
     * Retrieves a user by their ID.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Object} - The user object if found.
     * @throws {Error} - If the user is not found.
     */
    static getUserById(id) {
        const user = UserService.getUserById(id);
        if (!user) {
            throw Error('User not found');
        }
        return user;
    }

    /**
     * Creates a new user.
     * @param {Object} userModel - The user data to create.
     */
    static createUser(userModel) {
        UserService.createUser(userModel);
    }

    /**
     * Updates an existing user by their ID.
     * @param {string} id - The ID of the user to update.
     * @param {Object} userModel - The updated user data.
     * @returns {Object} - The updated user object.
     * @throws {Error} - If the user is not found.
     */
    static updateUser(id, userModel) {
        const updatedUser = UserService.updateUser(id, userModel);
        if (!updatedUser) {
            throw Error('User not found');
        }
        return updatedUser;
    }

    /**
     * Deletes a user by their ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Object} - The deleted user object.
     * @throws {Error} - If the user is not found.
     */
    static deleteUser(id) {
        const deletedUser = UserService.deleteUser(id);
        if (!deletedUser) {
            throw Error('User not found');
        }
        return deletedUser;
    }
}

export default UserController;
