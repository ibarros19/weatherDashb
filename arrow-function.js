[1, 2, 3].map(x => x + 10)

[1, 2, 3].map(function (x) {
    return x + 10
})

var car = {

    doors: 4,
    on: false,

    turnOn () {
        this.on = true
        const self = this
        setTimeout(function () {
            self.on = true
        }, 3000)
    }

}