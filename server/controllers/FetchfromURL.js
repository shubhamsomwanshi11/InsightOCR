const axios = require('axios');

const fetchFromURL = async (req, res) => {
    const fileUrl = req.query.url;
    try {
        const response = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
        });

        // Set the appropriate content-type based on the Dropbox file
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data); // Send the file data
    } catch (error) {
        console.error('Error fetching file from Dropbox:', error);
        res.status(500).send('Error fetching file from Dropbox');
    }
};

module.exports = fetchFromURL; 