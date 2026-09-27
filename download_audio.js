const https = require('https');
const fs = require('fs');

async function downloadSong() {
    console.log('Requesting audio from Cobalt...');
    
    const data = JSON.stringify({
        url: 'https://www.youtube.com/watch?v=R9K-585e_qQ',
        isAudioOnly: true,
        aFormat: 'mp3'
    });

    const options = {
        hostname: 'api.cobalt.tools',
        path: '/api/json',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', d => responseData += d);
        res.on('end', () => {
            try {
                const json = JSON.parse(responseData);
                if (json.url) {
                    console.log('Downloading from:', json.url);
                    https.get(json.url, (audioRes) => {
                        const file = fs.createWriteStream('song.mp3');
                        audioRes.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log('Download complete!');
                        });
                    });
                } else {
                    console.log('Error from cobalt:', json);
                }
            } catch(e) {
                console.log('Failed to parse json', responseData);
            }
        });
    });

    req.on('error', error => console.error(error));
    req.write(data);
    req.end();
}

downloadSong();
