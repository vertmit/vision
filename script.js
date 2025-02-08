const combinations = [
    ["L S","I O","D F","S N", "F W", "G P"], // score 1
    ["N M","F K", "J I","\\ /"], // score 2
    ["Y T","h n", "D C", "d a"], // score 3
    ["2 Z","C O",", .","l i", "D B", "U V"], // score 4
    ["O 0", "? !", "` '"], // score 5
    ["; :","K k", "1 l", "{ ["] // score 6
]

const emoteCombinations = [
    ["😶 🤢", "😡 🦍", "🐋 👥", "✅ 🐕"], // score 1
    ["🤣 😶", "🐖 🐏", "🧑🏼 🧑🏿", "🧑🏼‍🎓 🙅🏼‍♀️"], // score 2
    ["🥰 😍", "☺️ 😐", "😁 🫥"], // score 3
    ["✅ 🤢", "🥴 😵‍💫", "🐿️ 🦘"], // score 4
    ["💀 ☠️", "😺 😹", "🤨 😐"], // score 5
    ["🙊 🙉", "😼 😾", "🐪 🐫", "😀 😃", "🥺 🥹"] // score 6
]


function randint(min, max) {
    return Math.floor(Math.random() * (max-min))+min;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const aspectRatio = 3/5

let selectedTest = 0
let currentlevel = 1;
let gameover = false;

const shareOutcomes = [["scored", "got"],["a ", ""], ["found on", "at"], [window.location.href.split("//")[1].slice(0, -1), window.location.href], ["can", "could"], ["top", "beat"], ["result", "score"]]
const testNames = ["Character Pick", "Tone Divider", "Emotional Intelligence", "Cup n' ball"]

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
    const width = Math.floor((level+11)/3)
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

function getEmoteLevelData(level) {
    const combinationSrc = emoteCombinations[Math.floor(Math.min(level/7, emoteCombinations.length-1))]
    let combination = combinationSrc[randint(0, combinationSrc.length)]
    while (combination === prevCombination) {
        combination = combinationSrc[randint(0, combinationSrc.length)]
    }
    prevCombination = combination
    const width = Math.floor((level+11)/3)
    const height = Math.floor(width*aspectRatio)
    return {"size": [width, height], "letters":combination}
}

function generateEmoteLevel(level) {
    currentlevel = level
    const leveldata = getEmoteLevelData(level)
    const letters = leveldata.letters.split(" ")

    const quiztitle = document.getElementById("quiztitle")
    quiztitle.textContent = `👉🏼 ${letters[1]}`
    quiztitle.style.textDecoration = "none"

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
                        generateEmoteLevel(level+1)
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

function getPositionFromTranslate(value) {
    const clean = value.split("(")[1].split(")")[0].replace(/px/g, "").replace(",", "").split(" ")
    return [Number(clean[0]), Number(clean[1])]
}

function moveCups(cups, cupWidth, cupHeight, cupsWidth, cupsHeight, cupWidth, spacing) {
    let xPos = 0;
    let yPos = 0;
    for (let y = 0; y < cupsHeight; y++) {
        xPos = 0
        for (let x = 0; x < cupsWidth; x++) {
            const cup = cups[x + y * cupsWidth]
            cup.style.zIndex = x + y
            cup.style.transform = `translate(${(cupWidth+spacing)*x}px, ${(cupHeight+spacing)*y}px)`

            xPos ++
        }
        yPos ++
    }
}

function shuffleElements(parent) {
    let elements = []
    while (parent.firstChild) {
        elements.push(parent.firstChild)
        parent.firstChild.remove()
    }
    elements = shuffle(elements)
    while (elements[elements.length-1]) {
        parent.appendChild(elements[elements.length-1])
        elements.pop()
    }
}

let loss = false

function generateCupnBallLevel(level) {
    const cupsWidth = Math.floor((level+3)/2)
    const cupsHeight = Math.floor(cupsWidth*(2/3))

    document.body.style.cursor = "none"

    const cupWidth = ((window.innerWidth*0.5)/cupsWidth)*0.5
    const cupHeight = cupWidth * 5/3

    const cupSpacing = ((window.innerWidth*0.3)/cupsWidth)*0.5;


    const testcontainer = document.getElementById("quizitems")
    testcontainer.style.flexDirection = "row"
    testcontainer.style.flexWrap = "wrap"

    while (testcontainer.firstChild) {
        testcontainer.firstChild.remove()
    }

    testcontainer.style.width = `${cupsWidth*(cupWidth+cupSpacing)-cupSpacing}px`
    testcontainer.style.height = `${cupsHeight*(cupHeight+cupSpacing)-cupSpacing}px`

    const progressholder = document.createElement("div")
    progressholder.id = "timebar"

    const progressText = document.createElement("div")
    progressText.innerHTML = "Focus<br>Shuffling<br>Pick"
    progressText.classList.add("progresstext")
    progressholder.appendChild(progressText)

    document.body.appendChild(progressholder)

    const progress = document.createElement("div")
    progress.id = "progress"

    progressholder.appendChild(progress)

    let cuppos = []

    const winner = [Math.floor(cupsWidth/2), Math.floor(cupsHeight/2)]

    let winningcup;

    for (let y = 0; y < cupsHeight; y ++) {
        for (let x = 0; x < cupsWidth; x ++) {
            const cup = document.createElement("div")
            const tip = document.createElement("div")
            tip.style.backgroundColor = "white"
            tip.style.width = `${cupWidth*1.2}px`
            tip.style.height = `${cupHeight*0.1}px`
            tip.style.border = `${cupWidth/10}px solid black`
            tip.style.position = "absolute"
            tip.style.bottom = `-${cupWidth/10}px`
            tip.style.left = "50%"
            tip.style.transform = "translateX(-50%)"
            tip.style.borderRadius = " 50px 50px 50px 50px"
            cup.appendChild(tip)

            cup.classList.add("cup")
            cup.style.transform = `translate(${(cupWidth+cupSpacing)*x}px, ${(cupHeight+cupSpacing)*y}px)`
            cup.style.width = `${cupWidth}px`
            cup.style.height = `${cupHeight}px`
            cup.style.borderTopLeftRadius = `${cupWidth/6}px`
            cup.style.borderTopRightRadius = `${cupWidth/6}px`
            cup.style.border = `${cupWidth/10}px solid black`
            
            cup.x = cupWidth*x
            cup.y = cupHeight*y
            if (winner[0] === x && winner[1] === y) {
                winningcup = cup
            }
            testcontainer.appendChild(cup)
            cuppos.push(cup)
        }
    }
    let winnerstartpos = getPositionFromTranslate(winningcup.style.transform)
    const ball = document.createElement("div")
    ball.style.width = `${Math.min(cupWidth, cupHeight)*0.7}px`
    ball.style.height = `${Math.min(cupWidth, cupHeight)*0.7}px`
    ball.style.border =  `${cupWidth/10}px solid black`
    ball.style.borderRadius = "50%"
    ball.style.backgroundColor = "white"
    ball.style.position = "absolute"
    
    ball.style.zIndex = -100
    testcontainer.appendChild(ball)
    const ballOffset = [winningcup.offsetWidth/2-ball.offsetWidth/2, winningcup.offsetHeight-ball.offsetHeight]
    ball.style.display = "none"
    sleep(500).then(()=> {
        winningcup.style.transform = `translate(${winnerstartpos[0]}px, ${winnerstartpos[1]-cupHeight+10}px)`
        ball.style.display = "block"
        ball.style.transform = `translate(${winnerstartpos[0]+ballOffset[0]}px, ${winnerstartpos[1]+ballOffset[1]}px)`
    })
    sleep(1500).then(()=>{
        winningcup.style.transform = `translate(${winnerstartpos[0]}px, ${winnerstartpos[1]}px)`
        sleep(750).then(()=>{
            ball.style.display = "none"
        })
        
    })

    sleep(2500).then(()=>{
        shuffleElements(testcontainer)
        let shuffleAmount = level+3
        let speed = Math.max((1000 - (level/3)**2), 500)

        for (let cup of document.getElementsByClassName("cup")) {
            cup.style.transition = `${speed/4*2}ms`
        }
        let shufflesDone = 0
        let delay = 0
        progressText.style.transform = "translate(-50%, -35px)"
        progress.style.transition = `width ${speed*shuffleAmount}ms linear, background-color 250ms`
        progress.style.backgroundColor = "#FF9900"
        progress.style.width = `0%`
        
        for (let i = 0; i < shuffleAmount; i++) {
            sleep(speed*i).then(()=>{
                cuppos = shuffle(cuppos)
                moveCups(cuppos, cupWidth, cupHeight, cupsWidth, cupsHeight, cupWidth, cupSpacing)
                shufflesDone++;
                
            })
            delay ++
        }
        sleep(speed*delay).then(()=>{
            shuffleElements(testcontainer)
            progressText.style.transform = "translate(-50%, -72px)"
            document.body.style.cursor = "default"
            for (let cup of document.getElementsByClassName("cup")) {
                cup.style.cursor = "pointer"
                cup.style.transition = "750ms"
                cup.addEventListener("click", ()=>{
                    if (!loss) {
                        const cuppos = getPositionFromTranslate(cup.style.transform)
                        if (cup === winningcup) {
                            ball.style.transform = `translate(${cuppos[0]+ballOffset[0]}px, ${cuppos[1]+ballOffset[1]}px)`
                            ball.style.display = "block"
                            sleep(1000).then(()=>{
                                progress.style.transition = `250ms`
                                progress.style.backgroundColor = "rgb(58, 153, 49)"
                                progress.style.width = `100%`
                                progressText.style.transform = "translate(-50%, 0px)"
                                cup.style.transform = `translate(${cuppos[0]}px, ${cuppos[1]}px)`
                                sleep(1000).then(()=>{
                                generateCupnBallLevel(level+1)
                                })
                            })
                        } else {
                            loss = true
                            sleep(1000).then(()=>{
                                let winnercuppos = getPositionFromTranslate(winningcup.style.transform)
                                ball.style.transform = `translate(${winnercuppos[0]+ballOffset[0]}px, ${winnercuppos[1]+ballOffset[1]}px)`
                                ball.style.display = "block"
                                winningcup.style.transform = `translate(${winnercuppos[0]}px, ${winnercuppos[1]-cupHeight/2}px)`
                                sleep(1000).then(()=>{
                                    displayGameOver(level)
                                })
                            })
                        }
                        
                        cup.style.transform = `translate(${cuppos[0]}px, ${cuppos[1]-cupHeight/2}px)`
                    }
                })
            }
        })
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
        document.body.appendChild(timebar)
        if (selectedTest === 0){
            generateCharacterLevel(1)
        } else if (selectedTest === 1){
            generateHueLevel(1)
        } else if (selectedTest === 2){
            generateEmoteLevel(1)
        } else if (selectedTest === 3){
            timebar.remove()
            generateCupnBallLevel(1)
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
    testHolder.id = "tests"

    let index = 0
    delay = 0
    for (let test of testNames) {
        const btn = document.createElement("p")
        btn.classList.add("btn")
        btn.textContent = test
        const currentindex = index
        btn.addEventListener("click", ()=> {
            selectedTest = currentindex
            initTest()
        })
        testHolder.appendChild(btn)
        sleep(delay*1000).then(()=> {
            btn.style.animation = "appear 1s ease-out forwards"
        })
        btn.style.opacity = "0"
        delay += 0.1
        index ++;
    }
 
    document.body.appendChild(testHolder)
}

document.getElementById("start").addEventListener("click", ()=>{
    testMenu()
});