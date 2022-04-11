import { RenderTexture } from 'pixi.js';

const Vector = require('victor');

function randomBetween(min, max) {
    let result = (Math.random() * (Math.abs(max) + Math.abs(min))) - Math.abs(min)
    return result
}

function mapIntToInt(lowerBoundInput, upperBoundInput, lowerBoundOutput, upperBoundOutput, input) {
    return ((input / (upperBoundInput - lowerBoundInput)) * (upperBoundOutput - lowerBoundOutput))
}
function toHex(colours) {
    let b = "0x"
    colours.map(function (x) {             //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        b = b + ((x.length == 1) ? "0" + x : x)//Add zero if we get only one character
    })
    return parseInt(b)
}
function distBetween(posA, posB) {
    let xDiff = Math.abs(posA._x - posB._x)
    let yDiff = Math.abs(posA._y - posB._y)
    let totalDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
    return totalDiff
}

function differenceVector(currentX, currentY, destinationX, destinationY) {
    let xDiff = destinationX - currentX
    let yDiff = destinationY - currentY
    return new Vector(xDiff, yDiff)
}

function checkBounds(pos, bounds) {
    for (let bound of bounds) {
        if (pos.x > bound.x && pos.x < bound.x + bound.width && pos.y > bound.y && pos.y < bound.y + bound.height) {
            return true
        }
    }
    return false
}
function checkBoundsWithBoxes(rect, bounds) {
    for (let bound of bounds) {
        let longsideA = bound.width > bound.height ? bound.width : bound.height
        let longsideB = rect.width > rect.height ? rect.width : rect.height

        if (distBetween({ _x: bound.x, _y: bound.y }, { _x: rect.x, _y: rect.y }) < (longsideA + longsideB) * 1) {


            for (let corner of [
                { x: bound.x, y: bound.y },
                { x: bound.x + bound.width, y: bound.y },
                { x: bound.x, y: bound.y + bound.height },
                { x: bound.x + bound.width, y: bound.y + bound.height },
                { x: bound.x + bound.width / 2, y: bound.y + bound.height / 2 }
            ]) {
                if (corner.x > rect.x && corner.x < rect.x + rect.width) {
                    if (corner.y > rect.y && corner.y < rect.y + rect.height) {
                        return false
                    }
                }
            }

            for (let corner of [
                { x: rect.x, y: rect.y },
                { x: rect.x + rect.width, y: rect.y },
                { x: rect.x, y: rect.y + rect.height },
                { x: rect.x + rect.width, y: rect.y + rect.height },
            ]) {
                if (corner.x > bound.x && corner.x < bound.x + bound.width) {
                    if (corner.y > bound.y && corner.y < bound.y + bound.height) {
                        return false
                    }
                }
            }

            if (bound.x < rect.x && bound.x + bound.width > rect.x + rect.width) {
                if (bound.y > rect.y && bound.y < rect.y + rect.height) {
                    return false
                }
                if (bound.y + bound.height > rect.y && bound.y + bound.hieght < rect.y + rect.height) {
                    return false
                }
            }
            if (bound.y < rect.y && bound.y + bound.height > rect.y + rect.height) {
                if (bound.x > rect.x && bound.x < rect.x + rect.width) {
                    return false
                }
                if (bound.x + bound.width > rect.x && bound.x + bound.width < rect.x + rect.width) {
                    return false
                }
            }

        }
    }
    return true
}
export { randomBetween, distBetween, differenceVector, checkBounds, checkBoundsWithBoxes, mapIntToInt, toHex }