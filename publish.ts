import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';

const PORT = 8083;
const app = express();

app.use(express.static('./build'));

app.get('/*', renderCore);

app.listen(PORT, () => {
    console.log(`😎 Server is listening on port ${PORT}`);
});

function renderCore(req: any, res: any) {
    const indexFile = path.resolve('./build/index.html');
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, Something went wrong!');
        }
        return res.send(data);
    });
}