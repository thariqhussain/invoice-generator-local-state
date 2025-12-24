
import https from 'https';

const url = "https://apps.ddhost.in/invoice-generator/openapi.json";

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const spec = JSON.parse(data);
            const paths = spec.paths;
            console.log("API Paths supporting POST/PUT/DELETE:");
            for (const path in paths) {
                const methods = Object.keys(paths[path]);
                if (methods.some(m => ['post', 'put', 'delete'].includes(m))) {
                    console.log(`${path} [${methods.join(', ')}]`);
                }
            }
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error fetching URL:", err.message);
});
