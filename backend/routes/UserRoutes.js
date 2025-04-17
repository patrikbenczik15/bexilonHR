import express from 'express';
import UserController from '../controllers/UserController.js';

const userRouter = express.Router();

/**
 * Route to get a user by ID.
 * @route GET /user/:id
 * @param {string} id - The ID of the user to retrieve.
 */
userRouter.get('/user/:id', (req, res) => {
    try {
        const user = UserController.getUserById(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

/**
 * Route to create a new user.
 * @route POST /user
 * @param {Object} body - The user data to create.
 */
userRouter.post('/user', (req, res) => {
    try {
        UserController.createUser(req.body);
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Route to update an existing user by ID.
 * @route PATCH /user/:id
 * @param {string} id - The ID of the user to update.
 * @param {Object} body - The updated user data.
 */
userRouter.patch('/user/:id', (req, res) => {
    try {
        const updatedUser = UserController.updateUser(req.params.id, req.body);
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

/**
 * Route to replace an existing user by ID.
 * @route PUT /user/:id
 * @param {string} id - The ID of the user to replace.
 * @param {Object} body - The new user data.
 */
userRouter.put('/user/:id', (req, res) => {
    try {
        const updatedUser = UserController.updateUser(req.params.id, req.body);
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

/**
 * Route to delete a user by ID.
 * @route DELETE /user/:id
 * @param {string} id - The ID of the user to delete.
 */
userRouter.delete('/user/:id', (req, res) => {
    try {
        const deletedUser = UserController.deleteUser(req.params.id);
        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

export default userRouter;
