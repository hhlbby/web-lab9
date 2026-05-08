const express = require('express');
const router = express.Router();
const store = require('./store');

router.get('/view', (req, res) => {
    let items = store.getAll(); //
    
    const search = req.query.search || '';
    if (search) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const sort = req.query.sort || 'asc';
    items.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sort === 'asc') return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
    });

    const page = parseInt(req.query.page) || 1;
    const limit = 4; 
    const totalPages = Math.ceil(items.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    res.render('list', { 
        items: paginatedItems, 
        currentPage: page, 
        totalPages, 
        search, 
        sort 
    });
});

router.get('/items', (req, res) => {
    res.json(store.getAll());
});

router.get('/items/:id', (req, res) => {
    const item = store.getById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ error: 'Not found' });
});

router.post('/items', (req, res) => {
    const newItem = store.add(req.body);
    res.status(201).json(newItem);
});

router.put('/items/:id', (req, res) => {
    const updated = store.update(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ error: 'Not found' });
});

router.delete('/items/:id', (req, res) => {
    store.remove(req.params.id);
    res.status(204).end();
});

module.exports = router;