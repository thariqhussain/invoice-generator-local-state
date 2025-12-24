
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
            console.log("Details for /api/participant:");
            console.log(JSON.stringify(paths['/api/participant'], null, 2));
            console.log("\nDetails for /api/participants:");
            console.log(JSON.stringify(paths['/api/participants'], null, 2));
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error fetching URL:", err.message);
});
