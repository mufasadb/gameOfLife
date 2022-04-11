import * as PIXI from "pixi.js"
import * as Stats from "stats.js"
// import { cellWidth } from "./config";
// import { width, height, cellWidth } from "./config"


let cellWidth = 20
let horizontalCellCount = 80
let verticalCellCount = 45
let width = horizontalCellCount * cellWidth
let height = verticalCellCount * cellWidth


const stats = new Stats()
stats.showPanel(1);
document.body.appendChild(stats.dom)

const app = new PIXI.Application({
    width: width * 1.2,
    height: height * 1.2,
    backgroundColor: 0x000000,
    view: document.querySelector('#scene')
});

app.stage.sortableChildren = true

//create grid
const gr = new PIXI.Graphics()
gr.lineStyle(2, 0x000000)
for (let i = 0; i < horizontalCellCount; i++) {
    gr.moveTo(i * cellWidth, 0)
    gr.lineTo(i * cellWidth, height);
}
for (let i = 0; i < verticalCellCount; i++) {
    gr.moveTo(0, cellWidth * i)
    gr.lineTo(width, i * cellWidth)
}

class Cell extends PIXI.Container {
    constructor(x, y) {
        const cont = new PIXI.Container()
        super(cont)
        this.position.set(x * cellWidth, y * cellWidth)
        this.interactive = true
        const gr = new PIXI.Graphics()
        gr.beginFill(0xFFFFFF)
        gr.drawRect(0, 0, cellWidth, cellWidth)
        this.addChild(gr)
        // this.alive = Math.random() < 0.1? false: true
        this.alive = false
        this.upDownNeigh = 0
        this.drawing = gr
        this.visible = true
    }
    hide() {
        // this.drawing.visible = false
        this.drawing.visible = false
    }
    show() {
        // this.draw.visible = true
        this.drawing.visible = true
    }
    click() {
        if(this.alive){this.alive = false}else{this.alive=true}
    }
}

//initialise life array
let lifeArray = []
for (let i = 0; i < horizontalCellCount; i++) {
    let row = []
    for (let j = 0; j < verticalCellCount; j++) {
        // const gr = new PIXI.Graphics()
        // gr.beginFill(0xFFFFFF)
        // gr.drawRect(i * cellWidth, j * cellWidth, cellWidth, cellWidth)
        // app.stage.addChild(gr)

        // row.push({
        //     alive: Math.random() < 0.3 ? true : false,
        //     upDownNeigh: 0,
        //     drawing: gr
        // })
        const cell = new Cell(i, j)
        app.stage.addChild(cell)
        row.push(cell)
    }
    lifeArray.push(row)
}


class UpSpeedButton extends PIXI.Container {
    constructor(upSpeed) {
        const cont = new PIXI.Container()
        super(cont)
        this.position.set(width * 1.07, height * 0.25)
        const btgr = new PIXI.Graphics()
        btgr.beginFill(0xFFFFFF)
        btgr.drawRoundedRect(0, 0, width * 0.06, height * 0.05, 10)
        this.interactive = true
        this.addChild(btgr)
        this.text = new PIXI.Text("Faster")
        this.text.anchor.set(0.5, 0.5)
        this.text.position.set(width * 0.025, height * 0.025)
        this.addChild(this.text)
        this.upSpeed = upSpeed
    }
    click() {
        this.upSpeed()
    }
}
class DownSpeedButton extends PIXI.Container {
    constructor(downSpeed) {
        const cont = new PIXI.Container()
        super(cont)
        this.position.set(width * 1.07, height * 0.35)
        const btgr = new PIXI.Graphics()
        btgr.beginFill(0xFFFFFF)
        btgr.drawRoundedRect(0, 0, width * 0.06, height * 0.05, 10)
        this.interactive = true
        this.addChild(btgr)
        this.text = new PIXI.Text("Slower")
        this.text.anchor.set(0.5, 0.5)
        this.text.position.set(width * 0.025, height * 0.025)
        this.addChild(this.text)
        this.downSpeed = downSpeed
    }
    click() {
        this.downSpeed()
    }
}

class startButton extends PIXI.Container {
    constructor(running) {
        const cont = new PIXI.Container()
        super(cont)
        this.position.set(width * 1.05, height * 0.1)
        const btgr = new PIXI.Graphics()
        btgr.beginFill(0xFFFFFF)
        btgr.drawRoundedRect(0, 0, width * 0.1, height * 0.1, 10)
        this.interactive = true
        this.addChild(btgr)
        this.startText = new PIXI.Text("Start")
        this.startText.anchor.set(0.5, 0.5)
        this.startText.position.set(width * 0.05, height * 0.05)
        this.stopText = new PIXI.Text("Stop")
        if (running) { this.startText.visible = false }
        this.stopText.anchor.set(0.5, 0.5)
        this.stopText.position.set(width * 0.05, height * 0.05)
        if (running) { this.stopText.visible = true }
        this.addChild(this.startText)
        this.addChild(this.stopText)
    }
    click() {
        if (running) {
            running = false
            this.stopText.visible = false
            this.startText.visible = true
        } else {
            running = true
            this.stopText.visible = true
            this.startText.visible = false
        }
    }
}




//handle draw

function draw() {
    for (let i = 0; i < horizontalCellCount; i++) {
        for (let j = 0; j < verticalCellCount; j++) {
            if (!lifeArray[i][j].alive) {
                lifeArray[i][j].show()
            } else {
                lifeArray[i][j].hide()
            }
        }
    }
}

function doCycle() {
    //handle all centre cells
    for (let i = 1; i < horizontalCellCount - 1; i++) {
        for (let j = 1; j < verticalCellCount - 1; j++) {
            let neighbours = 0;
            if (lifeArray[i][j - 1].alive) { neighbours++ }
            if (lifeArray[i][j + 1].alive) { neighbours++ }
            if (lifeArray[i + 1][j - 1].alive) { neighbours++ }
            if (lifeArray[i + 1][j].alive) { neighbours++ }
            if (lifeArray[i + 1][j + 1].alive) { neighbours++ }
            if (lifeArray[i - 1][j - 1].alive) { neighbours++ }
            if (lifeArray[i - 1][j].alive) { neighbours++ }
            if (lifeArray[i - 1][j + 1].alive) { neighbours++ }
            if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
            } else {
                lifeArray[i][j].alive = false
            }
            if (!lifeArray[i][j].alive && neighbours == 3) {
                lifeArray[i][j].alive = true
            }
        }
    }
    doCorners(0, 0)
    doCorners(0, verticalCellCount - 1)
    doCorners(horizontalCellCount - 1, 0)
    doCorners(horizontalCellCount - 1, verticalCellCount - 1)
    doTopRow()
    doBottomRow()
    doLeftSide()
    doRightSide()
    //handle left and right column

}

function doCorners(i, j) {
    let neighbours = 0
    if (lifeArray[i][j - 1]) { if (lifeArray[i][j - 1].alive) { neighbours++ } }
    if (lifeArray[i][j + 1]) { if (lifeArray[i][j + 1].alive) { neighbours++ } }
    if (i == 0 && j > 0) { if (lifeArray[i + 1][j - 1].alive) { neighbours++ } }
    if (i == 0) { if (lifeArray[i + 1][j].alive) { neighbours++ } }
    if (i == 0 && j == 0) { if (lifeArray[i + 1][j + 1].alive) { neighbours++ } }
    if (i > 0 && j > 0) { if (lifeArray[i - 1][j - 1].alive) { neighbours++ } }
    if (i > 0) { if (lifeArray[i - 1][j].alive) { neighbours++ } }
    if (i > 0 && j == 0) { if (lifeArray[i - 1][j + 1].alive) { neighbours++ } }
    if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
    } else {
        lifeArray[i][j].alive = false
    }
    if (!lifeArray[i][j].alive && neighbours == 3) {
        lifeArray[i][j].alive = true
    }
}

function doTopRow() {
    let j = 0
    for (let i = 1; i < horizontalCellCount - 1; i++) {
        let neighbours = 0;
        if (lifeArray[i][j + 1].alive) { neighbours++ }
        if (lifeArray[i + 1][j].alive) { neighbours++ }
        if (lifeArray[i + 1][j + 1].alive) { neighbours++ }
        if (lifeArray[i - 1][j].alive) { neighbours++ }
        if (lifeArray[i - 1][j + 1].alive) { neighbours++ }
        if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
        } else {
            lifeArray[i][j].alive = false
        }
        if (!lifeArray[i][j].alive && neighbours == 3) {
            lifeArray[i][j].alive = true
        }
    }
}

function doBottomRow() {
    let j = verticalCellCount - 1
    for (let i = 1; i < horizontalCellCount - 1; i++) {
        let neighbours = 0;
        if (lifeArray[i][j - 1].alive) { neighbours++ }
        if (lifeArray[i + 1][j - 1].alive) { neighbours++ }
        if (lifeArray[i + 1][j].alive) { neighbours++ }
        if (lifeArray[i - 1][j - 1].alive) { neighbours++ }
        if (lifeArray[i - 1][j].alive) { neighbours++ }
        if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
        } else {
            lifeArray[i][j].alive = false
        }
        if (!lifeArray[i][j].alive && neighbours == 3) {
            lifeArray[i][j].alive = true
        }

    }
}

function doLeftSide() {
    let i = 0
    for (let j = 1; j < verticalCellCount - 1; j++) {
        let neighbours = 0;
        if (lifeArray[i][j - 1].alive) { neighbours++ }
        if (lifeArray[i][j + 1].alive) { neighbours++ }
        if (lifeArray[i + 1][j - 1].alive) { neighbours++ }
        if (lifeArray[i + 1][j].alive) { neighbours++ }
        if (lifeArray[i + 1][j + 1].alive) { neighbours++ }
        if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
        } else {
            lifeArray[i][j].alive = false
        }
        if (!lifeArray[i][j].alive && neighbours == 3) {
            lifeArray[i][j].alive = true

        }
    }
}
function doRightSide() {
    let i = horizontalCellCount - 1
    for (let j = 1; j < verticalCellCount - 1; j++) {
        let neighbours = 0;
        if (lifeArray[i][j - 1].alive) { neighbours++ }
        if (lifeArray[i][j + 1].alive) { neighbours++ }
        if (lifeArray[i - 1][j - 1].alive) { neighbours++ }
        if (lifeArray[i - 1][j].alive) { neighbours++ }
        if (lifeArray[i - 1][j + 1].alive) { neighbours++ }
        if (lifeArray[i][j].alive && neighbours > 1 && neighbours < 4) {
        } else {
            lifeArray[i][j].alive = false
        }
        if (!lifeArray[i][j].alive && neighbours == 3) {
            lifeArray[i][j].alive = true
        }
    }
}

app.stage.addChild(gr);


app.loader.load(doneLoading);

let deltaChange = 0
let cycle = 0
let running = false
let speedLimit = 60


function downSpeed() {
    speedLimit += 10
    console.log(speedLimit)
}
function upSpeed() {
    if(speedLimit > 10){speedLimit -= 10}
    console.log(speedLimit)
}

app.stage.addChild(new UpSpeedButton(upSpeed))
app.stage.addChild(new DownSpeedButton(downSpeed))


const start = new startButton(running)
app.stage.addChild(start)

function doneLoading(e) {
    app.ticker.add((delta) => {
        stats.begin();
        draw()
        if (running) {
            deltaChange += delta
            if (deltaChange > speedLimit) {
                cycle++
                deltaChange = 0
                doCycle()

            }
        }
        stats.end();
    });
}