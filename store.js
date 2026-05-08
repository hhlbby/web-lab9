const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const readData = () => {
    try {
        if (!fs.existsSync(dbPath)) return [];
        const content = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(content) || [];
    } catch (e) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
    getAll: () => readData(),
    
    getById: (id) => {
        const data = readData();
        return data.find(item => item.id === parseInt(id));
    },

    add: (item) => {
        const data = readData();
        const nextId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
        const newItem = { 
            ...item, 
            id: nextId, 
            status: item.status || 'Действителен' 
        };
        data.push(newItem);
        writeData(data);
        return newItem;
    },

    update: (id, newData) => {
        const data = readData();
        const index = data.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            data[index] = { ...data[index], ...newData };
            writeData(data);
            return data[index];
        }
        return null;
    },

    remove: (id) => {
        const data = readData();
        const filtered = data.filter(item => item.id !== parseInt(id));
        writeData(filtered);
        return true;
    }
};