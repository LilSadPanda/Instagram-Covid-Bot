const axios = require('axios')
const jimp = require('jimp')
require('dotenv').config()
const { registerFont,  createCanvas, loadImage } = require('canvas')
const { promisify } = require("util")
const { readFile, writeFileSync, unlink } = require("fs")
const { IgApiClient } = require('instagram-private-api')
const readFileAsync = promisify(readFile);

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '.' + mm + '.' + yyyy;

registerFont('./src/fonts/comicsans.ttf', {
    family: 'Comic Sans'
})

registerFont('./src/fonts/arial.ttf', {
    family: 'Arial'
})

const ig = new IgApiClient()

async function login() {
    ig.state.generateDevice('username');
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
}

const PostImage = async () => {
    await login()

    await ig.publish.photo({
        file: await readFileAsync('feed.jpg'),
        caption: `COVID-19 Update.\n${today}\n-\n-\n-\n-\n#StopTheSpread #Covid19 #Covid19update #covid19statistics #covid19SouthAfrica #SouthAfrica #CapeTown #wearamask`
    })

    await ig.publish.story({
        file: await readFileAsync('feed.jpg')
    })
    console.log('Uploaded to Instagram!')
}

const GenImage = async (object) => {
    const width = 1080
    const height = 1080

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    const diff = 65 + 20

    //TODAY
    context.fillStyle = '#6e8086'
    context.textAlign = 'center'
    context.font = 'bold 20pt "Arial"'
    context.fillText('Date: ' + today, 700, 110)

    //#StopTheSpread
    const StopTheSpread = '#StopTheSpread'
    var StopTheSpreadWidth = context.measureText(StopTheSpread).width
    context.fillStyle = '#6e8086'
    context.textAlign = 'center'
    context.font = 'bold 20pt "Arial"'
    context.fillText(StopTheSpread, 1080 / 2, 940)

    //COVID-19 UPDATE
    context.fillStyle = '#000'
    context.textAlign = 'left'
    context.font = 'bold 96pt "Arial"'
    context.fillText('COVID-19\nUpdate', 95, 400)

    //NEW CASES
    context.fillStyle = '#ffdf2c'
    const active = object.cases
    var activeWidth = context.measureText(active).width
    context.fillRect(95, 585, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(active, 387.5, 635)
    context.font = 'bold 30pt "Arial"'
    context.textAlign = 'left'
    context.fillText('CASES', 715, 615)

    //NEW DEATHS
    context.fillStyle = '#ffdf2c'
    const deaths = object.deaths
    var activeWidth = context.measureText(deaths).width
    context.fillRect(95, 585 + diff, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(deaths, 387.5, 635 + diff)
    context.font = 'bold 30pt "Arial"'
    context.textAlign = 'left'
    context.fillText('DEATHS', 715, 615 + diff)

    //NEW RECOVERED
    context.fillStyle = '#ffdf2c'
    const recovered = object.recovered
    var activeWidth = context.measureText(recovered).width
    context.fillRect(95, 585 + diff + diff, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(recovered, 387.5, 635 + diff + diff)
    context.font = 'bold 30pt "Arial"'
    context.textAlign = 'left'
    context.fillText('RECOVERED', 715, 615 + diff + diff)

    //credit
    context.textAlign = 'center'
    const credit = '@'+ process.env.IG_USERNAME
    var creditWidth = context.measureText(credit).width
    context.fillStyle = '#000'
    context.font = 'bold 40pt "Comic Sans"'
    context.fillText(credit, 1080 / 2, 1070)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync('./feed.png', buffer)

    jimp.read('feed.png', function(err, image) {
        if (err) {
            console.log(err)
        } else {
            image.write('feed.jpg')
            console.log('Converted from feed.png to feed.jpg')
            console.log('Deleted file: feed.png');

        }
    })
    await unlink('feed.png', (err => {
        if (err) console.log(err);
        else {
        }
    }))

    await PostImage()

}


const ApiFetch = async () => {
    const response = await axios.get('https://disease.sh/v3/covid-19/countries/');
    var object = {
        cases: 0,
        recovered: 0,
        deaths: 0,
        deaths: 0,
        active: 0
    }
    response.data.map((x) => {
        if (x.country == process.env.country) {
            console.log("API Successfully Loaded!");
            object.cases = x.cases;
            object.recovered = x.recovered;
            object.deaths = x.deaths;
            object.active = x.active;
        }
    })

    if (object.cases > 0) {
        GenImage(object)
    }

}

ApiFetch()