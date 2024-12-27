const levels = [
    {"size": [12, 5], "letters":["l o", "k d", "s f", "s q", "b s"]}
]

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

let prevCombination = ""

function getLevelData(level) {
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

let currentlevel = 1;
let gameover = false;
// `I scored ${level-1} on ${window.location}, can you do any better?`
const shareOutcomes = [["scored", "got"],["a ", ""], ["on", "at"], [window.location.href, window.location.href.slice(0, -1)], ["can", "could"], ["top", "beat"], ["result", "score"]]
console.log(window.location.href.slice(0, -1))
function getShareString(level) {
    let number = level
    let binarylist = []
    while (number > 0) {
        binarylist.push(number%2)
        number = Math.floor(number/2)
    }
    while (binarylist.length < 7) {
        binarylist.push(0)
    }
    binarylist = binarylist.reverse()
    console.log(binarylist)
    return `I ${shareOutcomes[0][binarylist[0]]} ${shareOutcomes[1][binarylist[1]]}${level-1} ${shareOutcomes[2][binarylist[2]]} ${shareOutcomes[3][binarylist[3]]}, ${shareOutcomes[4][binarylist[4]]} you ${shareOutcomes[5][binarylist[5]]} that ${shareOutcomes[6][binarylist[6]]}?`
}

console.log(getShareString(47))

function generateLevel(level) {
    currentlevel = level
    const leveldata = getLevelData(level)
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
                        generateLevel(level+1)
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
                const bluredbg = document.createElement("div")
                bluredbg.classList.add("bluredbg")
                document.body.appendChild(bluredbg)
                
                const title = document.createElement("h1")
                title.innerHTML = '<span class="headerani">Test over</span>'
                bluredbg.appendChild(title)

                const subtitle = document.createElement("p")
                subtitle.innerHTML = `<span class="textani">You scored ${level-1}</span>`
                bluredbg.appendChild(subtitle)

                const actions = document.createElement("div")
                actions.classList.add("actiontray")
                bluredbg.appendChild(actions)

                const actioncontents = document.createElement("div")
                actioncontents.classList.add("actioncon")
                actions.appendChild(actioncontents)

                const copyaction = document.createElement("i")
                copyaction.classList.add("fa-solid")
                copyaction.classList.add("fa-copy")
                copyaction.classList.add("action")
                copyaction.addEventListener("click", ()=>{
                    navigator.clipboard.writeText(getShareString(level))
                    copyaction.classList.remove("fa-copy")
                    copyaction.classList.add("fa-check")
                    sleep(1000).then(()=>{
                        copyaction.classList.add("fa-copy")
                        copyaction.classList.remove("fa-check")
                    })
                })
                actioncontents.appendChild(copyaction)

                const refreshaction = document.createElement("i")
                refreshaction.classList.add("fa-solid")
                refreshaction.classList.add("fa-rotate-right")
                refreshaction.classList.add("action")
                refreshaction.addEventListener("click", ()=>{
                    window.location.reload()
                })
                actioncontents.appendChild(refreshaction)

            })
        }
    })
}

document.getElementById("start").addEventListener("click", ()=>{
    document.getElementById("startcontent").remove()

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
    

    generateLevel(1)
});