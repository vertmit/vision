const combinations = [
    ["L S","I O","D F","S N", "F W", "G P"], // score 1
    ["N M","F K", "J I","\\ /"], // score 2
    ["Y T","h n", "D C", "d a"], // score 3
    ["2 Z","C O",", .","l i", "D B", "U V"], // score 4
    ["O 0", "? !", "` '"], // score 5
    ["; :","K k", "1 l", "{ ["] // score 6
]

function randint(min, max) {
    return Math.floor(Math.random() * (max-min))+min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const aspectRatio = 3/5

let selectedTest = 0
let currentlevel = 1;
let gameover = false;

const shareOutcomes = [["scored", "got"],["a ", ""], ["found on", "at"], [window.location.href.split("//")[1].slice(0, -1), window.location.href], ["can", "could"], ["top", "beat"], ["result", "score"]]
const testNames = ["Character Pick", "Tone Divider"]

function getShareString(level) {
    let number = level
    let binarylist = []
    while (number > 0 && binarylist.length<7) {
        binarylist.push(number%2)
        number = Math.floor(number/2)
    }
    while (binarylist.length < 7) {
        binarylist.push(0)
    }
    binarylist = binarylist.reverse()
    return `I ${shareOutcomes[0][binarylist[0]]} ${shareOutcomes[1][binarylist[1]]}${level-1} on ${testNames[selectedTest]} ${shareOutcomes[2][binarylist[2]]} ${shareOutcomes[3][binarylist[3]]}, ${shareOutcomes[4][binarylist[4]]} you ${shareOutcomes[5][binarylist[5]]} that ${shareOutcomes[6][binarylist[6]]}?`
}

function displayGameOver(level) {
    const bluredbg = document.createElement("div")
    bluredbg.classList.add("bluredbg")
    document.body.appendChild(bluredbg)
    
    const title = document.createElement("h1")
    title.textContent = "Test over"
    title.style.animation = "appear 2s forwards"
    title.style.opacity = 0
    title.style.position = "relative"
    title.style.textAlign = "center"

    bluredbg.appendChild(title)

    const subtitle = document.createElement("p")
    subtitle.textContent = `You scored ${level-1}`
    sleep(500).then(()=>{subtitle.style.animation = "appear 2s forwards"})
    subtitle.style.opacity = 0
    subtitle.style.position = "relative"
    subtitle.style.textAlign = "center"
    subtitle.style.paddingBottom = "10px"
    bluredbg.appendChild(subtitle)


    const actioncontents = document.createElement("div")
    actioncontents.classList.add("actions")
    
    bluredbg.appendChild(actioncontents)

    const shareaction = document.createElement("i")
    shareaction.classList.add("fa-solid")
    shareaction.classList.add("fa-share")
    shareaction.classList.add("action")
    shareaction.addEventListener("click", ()=>{
        navigator.share({text: getShareString(level)})
    })
    actioncontents.appendChild(shareaction)

    const refreshaction = document.createElement("i")
    refreshaction.classList.add("fa-solid")
    refreshaction.classList.add("fa-rotate-right")
    refreshaction.classList.add("action")
    refreshaction.addEventListener("click", ()=>{
        window.location.reload()
    })
    actioncontents.appendChild(refreshaction)
}

let prevCombination = ""

function getCharacterLevelData(level) {
    const combinationSrc = combinations[Math.floor(Math.min(level/7, combinations.length-1))]
    let combination = combinationSrc[randint(0, combinationSrc.length)]
    while (combination === prevCombination) {
        combination = combinationSrc[randint(0, combinationSrc.length)]
    }
    prevCombination = combination
    const width = Math.floor((level+10)/3)
    const height = Math.floor(width*aspectRatio)
    return {"size": [width, height], "letters":combination}
}

function generateCharacterLevel(level) {
    currentlevel = level
    const leveldata = getCharacterLevelData(level)
    const letters = leveldata.letters.split(" ")

    const quiztitle = document.getElementById("quiztitle")
    quiztitle.textContent = `Find the ${letters[1]}`

    const quizitems = document.getElementById("quizitems")
    while (quizitems.firstChild) {
        quizitems.firstChild.remove()
    }

    const oddlocation = [randint(0, leveldata.size[0]), randint(0, leveldata.size[1])]

    const timeprogress = document.getElementById("progress")
    timeprogress.style.animation = ""
    void timeprogress.offsetWidth;
    const wait = 7
    timeprogress.style.animation = `shrinkingbar ${wait}s linear forwards`

    const textSize = window.innerWidth / 1536 * ( (1 / leveldata.size[1])*500)

    let winner = null
    for (let y = 0; y < leveldata.size[1]; y++) {
        const row = document.createElement("div")
        row.classList.add("row")
        quizitems.appendChild(row)

        for (let x = 0; x < leveldata.size[0]; x++) {
            const item = document.createElement("div");
            item.classList.add("item")
            row.appendChild(item)

            const hitbox = document.createElement("div")
            hitbox.classList.add("hitbox")
            

            if (oddlocation[0] === x && oddlocation[1] === y) {
                item.textContent = letters[1]
                winner = item
                hitbox.addEventListener("click", ()=>{
                    if (!gameover) {
                        generateCharacterLevel(level+1)
                    }
                })
            }
            else {
                const innerspan = document.createElement("span")
                innerspan.textContent = letters[0]
                item.innerHTML = innerspan.outerHTML
                item.style.animation = `hide ${wait}s forwards`
                hitbox.addEventListener('click', () => {
                    if (!gameover) {
                        innerspan.classList.add("shake")
                        item.innerHTML = innerspan.outerHTML
                        item.appendChild(hitbox)
                    }
                });
        
            }
            item.appendChild(hitbox)
            item.style.fontSize = `${textSize}px`
            item.style.width = `${textSize}px`
            item.style.width = `${textSize}px`
        }
    }
    sleep(wait*1000).then(()=>{
        if (currentlevel === level) {
            gameover = true
            winner.classList.add("showwinner")
            sleep(1000).then(()=>{
                displayGameOver(level);
            })
        }
    })
}

function generateRandomColor() {
    return [randint(0, 255), randint(0, 255), randint(0, 255)]
}

function randsign() {
    if (Math.random() < 0.5) {
        return 1
    }
    return -1
}

function generateOddColour(baseColor, targetDistance) {
    let randomColor = [];
    let signs = [
        randsign(),
        randsign(),
        randsign()
    ]
    
    if (signs[0] === 1) {
        randomColor.push(randint(baseColor[0]+Math.floor(targetDistance/2-targetDistance/4), baseColor[0]+Math.floor(targetDistance/2)))
    } else {
        randomColor.push(randint(baseColor[0]-Math.floor(targetDistance/2), baseColor[0]-Math.floor(targetDistance/2-targetDistance/4)))
    }

    if (signs[1] === 1) {
        randomColor.push(randint(baseColor[1]+Math.floor(targetDistance/2-targetDistance/4), baseColor[1]+Math.floor(targetDistance/2)))
    } else {
        randomColor.push(randint(baseColor[1]-Math.floor(targetDistance/2), baseColor[1]-Math.floor(targetDistance/2-targetDistance/4)))
    }

    if (signs[2] === 1) {
        randomColor.push(randint(baseColor[2]+Math.floor(targetDistance/2-targetDistance/4), baseColor[2]+Math.floor(targetDistance/2)))
    } else {
        randomColor.push(randint(baseColor[2]-Math.floor(targetDistance/2), baseColor[2]-Math.floor(targetDistance/2-targetDistance/4)))
    }
    

    return randomColor;
}

function getHueLevelData(level) {
    let mainColour = generateRandomColor()
    const colors = [mainColour, generateOddColour(mainColour, Math.max(100-Math.floor(level/2), 3))]
    prevCombination = colors
    const width = Math.floor((level+10)/3)
    const height = Math.floor(width*aspectRatio)
    return {"size": [width, height], "colours":colors}
}

function generateHueLevel(level) {
    currentlevel = level
    const leveldata = getHueLevelData(level)

    const quiztitle = document.getElementById("quiztitle")
    quiztitle.textContent = ``

    const quizitems = document.getElementById("quizitems")
    while (quizitems.firstChild) {
        quizitems.firstChild.remove()
    }

    const oddlocation = [randint(0, leveldata.size[0]), randint(0, leveldata.size[1])]

    const timeprogress = document.getElementById("progress")
    timeprogress.style.animation = ""
    void timeprogress.offsetWidth;
    const wait = 7
    timeprogress.style.animation = `shrinkingbar ${wait}s linear forwards`

    const coloursize = window.innerWidth / 1536 * ( (1 / leveldata.size[1])*250)

    let winner = null
    for (let y = 0; y < leveldata.size[1]; y++) {
        const row = document.createElement("div")
        row.classList.add("row")
        quizitems.appendChild(row)

        for (let x = 0; x < leveldata.size[0]; x++) {
            const item = document.createElement("div");
            item.classList.add("item")
            item.classList.add("hue")
            row.appendChild(item)

            const hitbox = document.createElement("div")
            hitbox.classList.add("hitbox")
            

            if (oddlocation[0] === x && oddlocation[1] === y) {
                item.style.backgroundColor = `rgb(${leveldata.colours[1][0]}, ${leveldata.colours[1][1]}, ${leveldata.colours[1][2]})`
                winner = item
                hitbox.addEventListener("click", ()=>{
                    if (!gameover) {
                        generateHueLevel(level+1)
                    }
                })
            }
            else {
                item.style.backgroundColor = `rgb(${leveldata.colours[0][0]}, ${leveldata.colours[0][1]}, ${leveldata.colours[0][2]})`
                item.classList.add("dud")
                hitbox.addEventListener('click', () => {
                    if (!gameover) {
                        item.classList.remove('hueshake');
                        void item.offsetWidth;
                        item.classList.add("hueshake")
                        item.appendChild(hitbox)
                    }
                });
        
            }
            item.appendChild(hitbox)
            item.style.width = `${coloursize}px`
            item.style.width = `${coloursize}px`
        }
    }
    sleep(wait*1000).then(()=>{
        if (currentlevel === level) {
            gameover = true
            winner.classList.add("showwinner")
            for (let item of document.getElementsByClassName("dud")) {
                item.style.opacity = 0.2
            }
            sleep(1000).then(()=>{
                displayGameOver(level);
            })
        }
    })
}

function initTest() {
    const testHolder = document.getElementById("tests")
    let delay = 0
    for (let elmt of testHolder.children) {
        sleep(delay*1000).then(()=> {
            elmt.style.animation = "disappear 500ms ease-in forwards"
        })
        elmt.style.mouseEvents = "none"
        elmt.style.cursor = "default"
        delay += 0.1
    }
    sleep(delay*1000+500).then(()=> {
        testHolder.remove()
        const timebar = document.createElement("div")
        timebar.id = "timebar"
        document.body.appendChild(timebar)
        const timeprogress = document.createElement("div")
        timeprogress.id = "progress"
        timebar.appendChild(timeprogress)

        const quizcontent = document.createElement("div")
        quizcontent.classList.add("floatingcontentpro")
        document.body.appendChild(quizcontent)

        const quiztitle = document.createElement("h1")
        quiztitle.id = "quiztitle"
        quizcontent.appendChild(quiztitle)

        const quizitems = document.createElement("div")
        quizitems.id = "quizitems"

        quizcontent.appendChild(quizitems)
        if (selectedTest === 0){
            generateCharacterLevel(1)
        } else if (selectedTest === 1){
            generateHueLevel(1)
        }
        
    })
}

const homemenu = document.getElementById("startcontent")

function testMenu() {
    let delay = 0
    for (let elmt of homemenu.children) {
        sleep(delay*1000).then(()=> {
            elmt.style.animation = "disappear 500ms ease-in forwards"
        })
        elmt.style.mouseEvents = "none"
        elmt.style.cursor = "default"
        delay += 0.1
    }
    sleep(delay*1000+500).then(()=> {
        homemenu.remove()
    })
    const testHolder = document.createElement("div")
    testHolder.classList.add("floatingcontent")

    const charactor = document.createElement("p")
    charactor.classList.add("btn")
    charactor.textContent = "Character Pick"
    charactor.addEventListener("click", ()=> {
        selectedTest = 0
        initTest()
    })
    testHolder.appendChild(charactor)
    testHolder.id = "tests"

    const hue = document.createElement("p")
    hue.classList.add("btn")
    hue.textContent = "Tone Divider"
    testHolder.appendChild(hue)
    hue.addEventListener("click", ()=> {
        selectedTest = 1
        initTest()
    })

    delay = 0
    for (let elmt of testHolder.children) {
        sleep(delay*1000).then(()=> {
            elmt.style.animation = "appear 1s ease-out forwards"
        })
        elmt.style.opacity = "0"
        delay += 0.1
    }

    document.body.appendChild(testHolder)
}

document.getElementById("start").addEventListener("click", ()=>{
    testMenu()
});