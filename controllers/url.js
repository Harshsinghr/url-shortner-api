require('dotenv').config();
const { nanoid } = require('nanoid');
const validator = require('validator');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'URL is required' });
    if (!validator.isURL(body.url)) return res.status(400).json({ error: 'Invalid URL format' });

    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 7 days expiration
    });

    return res.json({ shortUrl: `${process.env.BASE_URL}/${shortID}` });
}

async function handleRedirect(req, res) {
    const url = await URL.findOne({ shortId: req.params.code });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    if (url.expiresAt && url.expiresAt < Date.now()) return res.status(410).json({ error: 'URL expired' });

    url.visitHistory.push({ timestamp: Date.now() });
    await url.save();

    return res.redirect(url.redirectURL);
}

module.exports = {
    handleGenerateNewShortURL,
    handleRedirect
};