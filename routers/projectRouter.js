const express = require('express');
const Projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The projects information could not be retrieved', err })
        });
});

router.get('/:id', validateId(), (req, res) => {
    res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId(), (req, res) => {
    res.status(200).json(req.actions)
});


router.post('/', validateNewProjectData(), (req, res) => {
    res.status(201).json(req.project);
});

router.put('/:id', (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json(project);
            } else {
                res.status(404).json(null);
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'There was an error while updating your project.' });
        });
});

router.delete('/:id', (req, res) => {
    Projects.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ count, message: 'Project pulverized.' })
            } else {
                res.status(404).json({ message: 'Project specified not be found.' });
            };
        })
        .catch(err => {
            res.status(500).json({ error: 'Error deleting specified project.' });
        });
});


//~~~~~~~~~~~~  MIDDLEWARE  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validateId() {
    return (req, res, next) => {
        Projects.get(req.params.id)
            .then(project => {
                if (project) {
                    req.project = project
                    next()
                } else {
                    res.status(404).json({ message: 'Project not found.' });
                };
            })
            .catch(err => {
                res.status(500).json({ errorMessage: 'Error retrieving project.' });
            });
    };
};

function validateProjectId() {
    return (req, res, next) => {
        Projects.getProjectActions(req.params.id)
            .then(actions => {
                if (actions) {
                    req.actions = actions
                    next()
                } else {
                    res.status(404).json({ message: 'Actions not found.' });
                };
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'Actions could not be retrived.' });
            });
    };
};

function validateNewProjectData() {
    return (req, res, next) => {
        const { name, description } = req.body;
        const project = { name, description };

        Projects.insert(project)
            .then(project => {
                if (name && description) {
                    req.project = project
                    next()
                } else if (!name || !description) {
                    res.status(400).json({ message: 'Please provide name and description for the project.' });
                };
            })
            .catch(err => {
                res.status(500).json({ error: 'There was an error while saving your project to the database.' });
            });
    };
};




module.exports = router;