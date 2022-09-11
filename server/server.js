const express = require('express');
const { appendFile } = require('fs');

const App = express();

App.get("/users", (req, res) => {
    res.json({"users": ["steve"]})
})

App.listen(4000, () => {console.log('Server is going on 4000')})