require("dotenv").config();
var express = require('express'); // requre the express framework
var app = express();
var fs = require('fs'); //require file system object\
const ftp = require("basic-ftp")
const cors = require('cors');
const csv = require('csvtojson')
const json2csv = require('json2csv').parse;
app.use(cors())


app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT;
let error = false;
const ftpHost = process.env.FTP_HOST_ADDRESS;
const ftpUserName = process.env.FTP_USER_NAME;
const ftpPassword = process.env.FTP_PASSWORD;
let finalIndex = []
let botProp;
let userID;
let pageNumber = 1;
let limit = 10;
let result;

const paged = {
    msg: "success",
    totalCount: 0,
    lastIndex: 0,
    result: []
}
const singleData = {
    msg: "success",
    data: [],
}
const invalid = {
    invalid: "invalid"
}
const valid = {
    valid: "valid"
}

// Remove duplicates from array
function removeDuplicates(dataArray) {
    return [...new Set(dataArray)];
}

//  create csv to json
async function convertCsvToJson(path, startIndex, endIndex, res) {
    try {
        const empty = (arr) => arr.length = 0;
        const jsonArray = await csv().fromFile(path);
        result = jsonArray;
        const resultedArray = [];
        let index = [];
        jsonArray.map((data, key) => {
            // console.log(key + 1)
            index.push(data.index)
            if (paged.totalCount <= parseInt(data.index)) {
                // console.log(data.index)
                paged.lastIndex = data.index;
            }
            if (startIndex <= data.index && data.index <= endIndex) {
                resultedArray.push(data);
            }
        })
        // console.log(paged.totalCount)
        finalIndex = removeDuplicates(index)
        paged.totalCount = finalIndex.length;
        resultedArray.map((data) => paged.result.push(data))
        res.status(200).send(paged);
        // console.log("before" + resultedArray);
        empty(finalIndex)
        empty(resultedArray)
        empty(paged.result)
        // console.log("after " + resultedArray)
    } catch (err) {
        console.error(err);
        error = true
    }
}
// Funtion to Download Data 
async function get(userID, pass, res) {
    const client = new ftp.Client()
    client.ftp.verbose = true;
    try {
        await client.access({
            host: ftpHost,
            user: ftpUserName,
            password: ftpPassword,
            secure: true
        })
        file = await client.list(`./site/wwwroot/${userID}/`)
        await client.downloadTo(`temp/${userID}faq_data.csv`, `./site/wwwroot/${userID}/faq_data.csv`)
        await client.downloadTo(`temp/${userID}botproperties.json`, `./site/wwwroot/${userID}/botproperties.json`)
        fs.readFile(__dirname + `/temp/${userID}botproperties.json`, 'utf8', function (err, data) {
            if (err) {
                error = false;
            }
            botProp = JSON.parse(data);
            password = botProp.generalSettings.botSecret.substring(0, 8);
            if (password === pass) {
                return res.status(200).send(valid)
            }
            else {
                return res.status(404).send(invalid)
            }

        });
    }
    catch (err) {
        console.log("error " + err)
        return res.status(404).send(invalid)
    }
    client.close()

};

async function upload(userID, res) {
    const client = new ftp.Client()
    client.ftp.verbose = true;
    try {
        await client.access({
            host: ftpHost,
            user: ftpUserName,
            password: ftpPassword,
            secure: true
        })
        file = await client.list(`./site/wwwroot/${userID}/`)
        await client.uploadFrom(`temp/${userID}faq_data.csv`, `./site/wwwroot/${userID}/faq_data.csv`);
        res.status(200).send(valid)

    }
    catch (err) {
        console.log("error " + err)
        return res.status(404).send(invalid)
    }
    client.close()

};
async function signleUpdate(path, id, res) {
    try {
        const empty = (arr) => arr.length = 0;
        const jsonArray = await csv().fromFile(path);
        result = jsonArray;
        const resultedArray = [];

        jsonArray.map((data) => {
            if (id == data.index) {
                resultedArray.push(data);
            }
        })
        // console.log(paged.totalCount)
        resultedArray.map((data) => singleData.data.push(data))
        res.status(200).send(singleData);
        empty(resultedArray)
        empty(singleData.data)
    } catch (err) {
        console.error(err);
        error = true
    }
}
async function singleDelete(path, id, res) {
    try {
        const empty = (arr) => arr.length = 0;
        const jsonArray = await csv().fromFile(path);
        result = jsonArray;
        const resultedArray = [];
        let index = [];
        result.map((it) => {
            if (parseInt(it.index) != parseInt(id)) {
                resultedArray.push(it)
            }
        })
        resultedArray.map((item) => {
            if (parseInt(id) < parseInt(item.index)) {
                item.index = parseInt(item.index) - 1
            }
        })
        resultedArray.map((d, key) => {
            index.push(d.index);
        });
        finalIndex = removeDuplicates(index);
        const mod = json2csv(resultedArray, { quotes: '' });
        fs.writeFile(`./temp/${userID}faq_data.csv`, mod, (err) => {
            if (err) {
                return res.status(404).send(invalid)
            } else {
                return res.status(200).send(valid)
            }
        });
        // res.status(200).send(valid);
        empty(resultedArray)
        empty(singleData.data)
    } catch (err) {
        console.error(err);
        error = true
    }
}
async function modify(userID, path, data1, id, res) {
    try {
        const empty = (arr) => arr.length = 0;
        const jsonArray = await csv().fromFile(path);
        result = jsonArray;
        const resultedArray = [];
        let index = [];
        // console.log(data1)
        jsonArray.map((data) => {
            if (id == data.index) {
                resultedArray.push(data);
            }
        })
        result.map((data, key) => {
            if (id == data.index) {
                data1.map((d, i) => {
                    data.question = d.question;
                })
            }
            else if (id > data.index) {
                data1.push(data)
            }
            else {
                data1.unshift(data)
            }
        })
        data1.map((d, key) => {
            index.push(d.index);
        });
        finalIndex = removeDuplicates(index);

        // console.log("========================")
        // console.log(data1)

        const mod = json2csv(data1, { quotes: '' });
        fs.writeFile(`./temp/${userID}faq_data.csv`, mod, (err) => {
            if (err) {
                return res.status(404).send(invalid)
            } else {
                return res.status(200).send(valid)
            }
        });

        // res.status(200).send(singleData);
        empty(resultedArray)
    } catch (err) {
        console.error(err);
        error = true
    }
}
async function singleAdd(userID, path, data, res) {
    try {
        const jsonArray = await csv().fromFile(path);
        data.map((da) => {
            let header = { question: da.question, answer: da.answer, index: da.index, asd: "", ASD: "" }
            jsonArray.push(header)
        })
        // for(let i=0;i<data.le)
        const mod = json2csv(jsonArray, { quotes: '' });
        fs.writeFile(`./temp/${userID}faq_data.csv`, mod, (err) => {
            if (err) {
                return res.status(404).send(invalid)
            } else {
                return res.status(200).send(valid)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(404).send(invalid)
    }
}

async function searchValue(path, value, res) {
    try {
        const empty = (arr) => arr.length = 0;
        const jsonArray = await csv().fromFile(path);
        result = jsonArray;
        const resultedArray = [];
        result.map((it) => {
            if (it.question.toLowerCase().includes(value.toLowerCase())) {
                // console.log("sssssssssssss")
                resultedArray.push(it)
            }
        })
        resultedArray.map((data) => singleData.data.push(data))
        res.status(200).send(singleData);
        empty(resultedArray)
        empty(singleData.data)
    } catch (err) {
        console.error(err);
        error = true
    }
}

// End point for search 
app.post("/search", function (req, res) {
    userID = req.body.userID;
    value = req.body.value;
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        searchValue(csvFilePath, value, res)
    }
    else {
        res.status(404).send(invalid)
    }

})
// End point For Login 
app.post("/login", function (req, res) {
    userID = req.body.userID;
    if (userID) {
        get(req.body.userID, req.body.password, res)
    }
    else {
        res.status(404).send(invalid)
    }

})
// End point for add
app.post("/add", function (req, res) {
    userID = req.body.userID;
    data = req.body.data;
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        singleAdd(userID, csvFilePath, data, res)
    }
    else {
        res.status(404).send(invalid)
    }

})
// end point for modifying the file
app.post("/modify", function (req, res) {
    userID = req.body.userID;
    data = req.body.data;
    id = req.body.id;
    // console.log(data)
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        modify(userID, csvFilePath, data, id, res)
    }
    else {
        res.status(404).send(invalid)
    }

})
// end point for delete
app.post("/delete", function (req, res) {
    id = req.body.id;
    userID = req.body.userID;
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        singleDelete(csvFilePath, id, res);
        if (error) {
            res.status(404).send(invalid)
        }
    }
    else {
        res.status(404).send(invalid)
    }
})
//  end point to get data in paginated form
app.post("/data", function (req, res) {
    pageNumber = req.body.pageNumber;
    limit = req.body.limit;
    userID = req.body.userID;
    const startIndex = ((pageNumber - 1) * limit) + 1;
    // console.log(startIndex);
    const endIndex = pageNumber * limit;
    // console.log(endIndex)
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        convertCsvToJson(csvFilePath, startIndex, endIndex, res);
        if (error) {
            res.status(404).send(invalid)
        }

    }
    else {
        res.status(404).send(invalid)
    }

})
//end point for upload the data back in the server
app.post("/upload", function (req, res) {
    userID = req.body.userID;
    if (userID) {
        upload(userID, res)
    }
    else {
        return res.status(404).send(invalid)

    }
})
// end point to send single data
app.post("/update", function (req, res) {
    id = req.body.id;
    userID = req.body.userID;
    if (userID) {
        const pth = `/temp/${userID}faq_data.csv`
        const csvFilePath = `.${pth}`
        signleUpdate(csvFilePath, id, res);
        if (error) {
            res.status(404).send(invalid)
        }
    }
    else {
        res.status(404).send(invalid)
    }
})

// Create a server to listen at port 8080
var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})