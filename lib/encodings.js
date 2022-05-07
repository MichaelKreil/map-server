'use strict'

const lookup = new Map();

module.exports = {
	parseEncodings,
	respondWithEncoding,
}

function parseEncodings(req) {
	let encodingString = req.headers['accept-encoding'];
	if (lookup.has(encodingString)) return lookup.get(encodingString);

	let result = {};
	(''+encodingString).toLowerCase().split(',').forEach(encoding => {
		result[encoding.trim()] = true;
	})
	lookup.set(encodingString, result);
	if (lookup.size > 1000) lookup = new Map();
	return result;
}

async function respondWithEncoding(res, result, encodings, headers = {}) {
	delete headers['Content-Encoding'];
	
	if (encodings.br && result.br) {
		headers['Content-Encoding'] = 'br';
		res.writeHead(200, headers);
		res.end(result.br)
		return;
	}

	if (encodings.gzip && result.gzip) {
		headers['Content-Encoding'] = 'gzip';
		res.writeHead(200, headers);
		res.end(result.gzip)
		return;
	}

	if (!result.raw) result.raw = await gunzip(encodings.gzip);

	res.writeHead(200, headers);
	res.end(result.raw)
}