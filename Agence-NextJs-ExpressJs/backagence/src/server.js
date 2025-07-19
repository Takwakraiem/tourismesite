const server = require('./app');
const { PORT } = process.env || 3000;
require('dotenv').config(); 
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
