const { default: axios } = require("axios");
const igdl = require("instagram-url-direct")
const url = 'https://www.instagram.com/stories/_fwjw/';

(async () => {
    const res = await igdl(url)
    const data = await Promise.all(res.url_list.map(async url => {
        try {
            const metadata = await axios.head(url);
            return {
                type: "photo",
                media: url
            }
        } catch (err) {
            return {
                type: "video",
                media: url
            }
        }
    }))
    const chunkSize = 10;
    let chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        chunks.push(chunk)
    }

})();


console.log(["a", "b"].slice(0, 4))