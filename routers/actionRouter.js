const express = require('express');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'The actions information could not be retrieved.' });
        })
});

router.get('/:id', (req, res) => {
    Actions.get(req.params.id)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).json({ message: 'The action with specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'The action with specified ID could not be retrieved.' });
        });
});

router.post('/', (req, res) => {
    const { project_id, description, notes } = req.body;
    const action = { project_id, description, notes }

    Actions.insert(action)
        .then(action => {
            if (project_id && description && notes) {
                res.status(201).json(action);
            } else if (!project_id || !description || !notes) {
                res.status(400).json({ message: 'Please provide project ID, description, and notes for the action.' });
            };
        })
        .catch(err => {
            res.status(500).json({ error: 'There was an error while adding action.' });
        });
});

router.put('/:id', (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).json(null);
            };
        })
        .catch(err => {
            res.status(500).json({ error: 'There was an error updating action.' });
        });
});

router.delete('/:id', (req, res) => {
    Actions.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ count, message: 'Action pulverized.' });
            } else {
                res.status(404).json({ message: 'Action specified not found.' });
            };
        })
        .catch(err => {
            res.status(500).json({ error: 'Error deleting specified action.' });
        });
});

module.exports = router;