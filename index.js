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

//const PostFeedImage = async () => {
//    await login()
//
//    await ig.publish.photo({
//        file: await readFileAsync('feed.jpg'),
//        caption: `COVID-19 Update.\n${today}\n-\n-\n-\n-\n#StopTheSpread #Covid19 #Covid19update #covid19statistics #covid19SouthAfrica #SouthAfrica #CapeTown #wearamask`
//    })
//    console.log('Uploaded to Instagram feed!')
//}

const PostStoryImage = async () => {
    await login()

    await ig.publish.story({
        file: await readFileAsync('story.jpg')
    })
    console.log('Uploaded to Instagram story!')

    await ig.publish.photo({
        file: await readFileAsync('feed.jpg'),
        caption: `COVID-19 Update.\n${today}\n-\n-\n-\n-\n#StopTheSpread #Covid19 #Covid19update #covid19statistics #covid19SouthAfrica #SouthAfrica #CapeTown #wearamask`
    })
    console.log('Uploaded to Instagram feed!')
}

const GenFeedImage = async (object) => {
    const width = 1080
    const height = 1080

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)

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
    context.fillText(StopTheSpread, 1080 / 2, 900)

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
    context.fillRect(95, 670, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(deaths, 387.5, 720)
    context.font = 'bold 30pt "Arial"'
    context.textAlign = 'left'
    context.fillText('DEATHS', 715, 700)

    //NEW RECOVERED
    context.fillStyle = '#ffdf2c'
    const recovered = object.recovered
    var activeWidth = context.measureText(recovered).width
    context.fillRect(95, 755, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(recovered, 387.5, 805)
    context.font = 'bold 30pt "Arial"'
    context.textAlign = 'left'
    context.fillText('RECOVERED', 715, 785)

    //credit
    context.textAlign = 'center'
    const credit = '@'+ process.env.IG_USERNAME
    var creditWidth = context.measureText(credit).width
    context.fillStyle = '#000'
    context.font = 'bold 40pt "Comic Sans"'
    context.fillText(credit, 1080 / 2, 970)

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

    //await PostFeedImage()

}


const GenStoryImage = async (object) => {
    const width = 1080
    const height = 1920

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)

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
    context.fillText(StopTheSpread, 1080 / 2, 1490)

    //COVID-19 UPDATE
    context.fillStyle = '#000'
    context.textAlign = 'left'
    context.font = 'bold 96pt "Arial"'
    context.fillText('COVID-19\nUpdate', 95, 315)

    //TOTAL ACTIVE TEXT
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Arial"'
    context.fillText('NEW STATS', 387.5, 550)

    //NEW CASES
    context.fillStyle = '#ffdf2c'
    const NewCases = object.todayCases
    context.fillRect(95, 585, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(NewCases, 387.5, 635)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('NEW\nCASES', 715, 610)

    //NEW DEATHS
    context.fillStyle = '#ffdf2c'
    const NewDeaths = object.todayDeaths
    context.fillRect(95, 670, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(NewDeaths, 387.5, 720)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('NEW\nDEATHS', 715, 695)

    //NEW RECOVERED
    context.fillStyle = '#ffdf2c'
    const NewRecovered = object.todayRecovered
    context.fillRect(95, 755, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(NewRecovered, 387.5, 805)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('NEW\nRECOVERED', 715, 780)

    //TOTAL ACTIVE TEXT
    context.fillStyle = '#ffdf2c'
    context.fillRect(95, 1010, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Arial"'
    context.fillText('TOTAL STATS', 387.5, 890)

    //TOTAL CASES
    context.fillStyle = '#ffdf2c'
    const TotalCases = object.cases
    context.fillRect(95, 925, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(TotalCases, 387.5, 975)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('TOTAL\nCASES', 715, 950)

    //TOTAL DEATHS
    context.fillStyle = '#ffdf2c'
    const TotalDeaths = object.deaths
    context.fillRect(95, 1010, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(TotalDeaths, 387.5, 1060)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('TOTAL\nDEATHS', 715, 1035)

    //TOTAL RECOVERED
    context.fillStyle = '#ffdf2c'
    const TotalRecovered = object.recovered
    context.fillRect(95, 1095, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(TotalRecovered, 387.5, 1145)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('TOTAL\nRECOVERED', 715, 1120)

    //OTHER STATISTICS
    context.fillStyle = '#ffdf2c'
    context.fillRect(95, 1265, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Arial"'
    context.fillText('OTHER STATISTICS', 387.5, 1230)

    //TOTAL ACTIVE
    context.fillStyle = '#ffdf2c'
    const TotalActive = object.active
    context.fillRect(95, 1265, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(TotalActive, 387.5, 1315)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('TOTAL\nACTIVE', 715, 1290)

    //TOTAL TESTS
    context.fillStyle = '#ffdf2c'
    const TotalTests = object.tests
    context.fillRect(95, 1350, 585, 65)
    context.fillStyle = '#000'
    context.textAlign = 'center'
    context.font = 'bold 32pt "Comic Sans"'
    context.fillText(TotalTests, 387.5, 1400)
    context.font = 'bold 25pt "Arial"'
    context.textAlign = 'left'
    context.fillText('TOTAL\nTESTS', 715, 1375)

    //credit
    context.textAlign = 'center'
    const credit = '@'+ process.env.IG_USERNAME
    var creditWidth = context.measureText(credit).width
    context.fillStyle = '#000'
    context.font = 'bold 40pt "Comic Sans"'
    context.fillText(credit, 1080 / 2, 1810)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync('./story.png', buffer)

    jimp.read('story.png', function(err, image) {
        if (err) {
            console.log(err)
        } else {
            image.write('story.jpg')
            console.log('Converted from story.png to story.jpg')
            console.log('Deleted file: story.png');

        }
    })
    await unlink('story.png', (err => {
        if (err) console.log(err);
        else {
        }
    }))

    await PostStoryImage()

}


const ApiFetch = async () => {
    const response = await axios.get('https://disease.sh/v3/covid-19/countries/');
    var object = {
        cases: 0,
        todayCases: 0,
        deaths: 0,
        todayDeaths: 0,
        recovered: 0,
        todayRecovered: 0,
        active: 0,
        tests: 0
    }
    response.data.map((x) => {
        if (x.country == process.env.country) {
            console.log("API Successfully Loaded!");
            object.cases = x.cases;
            object.todayCases = x.todayCases;
            object.deaths = x.deaths;
            object.todayDeaths = x.todayDeaths;
            object.recovered = x.recovered;
            object.todayRecovered = x.todayRecovered;
            object.active = x.active;
            object.tests = x.tests;
        }
    })

    if (object.cases > 0) {
        GenFeedImage(object)
        GenStoryImage(object)
    }

}

ApiFetch()