/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Vector {\n\n    constructor(x, y) {\n        this.x = x; this.y = y;\n    }\n\n    plus(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n\n    times(factor) {\n        return new Vector(this.x * factor, this.y * factor);\n    }\n\n}\n\nclass Player {\n\n    constructor(pos, speed, slashing) {\n        this.pos = pos;\n        this.speed = speed;\n        this.slashing = slashing;\n    }\n\n    get type() { return \"player\"; }\n\n    static create(pos) {\n        return new Player(pos.plus(new Vector(0, -0.6)),\n            new Vector(0, 0));\n    }\n    \n}\n\nPlayer.prototype.size = new Vector(0.8, 1.6) // this in tandem with the static create offsets the player character the appropriate distance so it sits on top of the block below\n\nclass Door {\n\n    constructor(pos) {\n        this.pos = pos;\n    }\n\n    get type() {return \"door\";}\n\n    static create(pos) {\n        return new Door(pos.plus(new Vector(-0.1, -0.2)),\n            new Vector(0, 0));\n    }\n\n}\n\nDoor.prototype.size = new Vector(1, 1.2)\n\n\nclass Enemy {\n    constructor(pos, speed) {\n        this.pos = pos;\n        this.speed = speed;\n    }\n\n    get type() {return \"enemy\";}\n\n    static create(pos) {\n        return new Enemy(pos.plus(new Vector(0, -0.6)),\n            new Vector(2, 0))\n    }\n}\n\nEnemy.prototype.size = new Vector(0.8, 1.6);\n\nEnemy.prototype.update = function (time, state) {\n    let newPos = this.pos.plus(this.speed.times(time));\n    if (!state.level.touches(newPos, this.size, \"invisibleWall\")) {\n        return new Enemy(newPos, this.speed, this.reset);\n    } else {\n        return new Enemy(this.pos, this.speed.times(-1));\n    }\n};\n\nEnemy.prototype.collide = function(state) {\n    let filtered = state.actors.filter(a => a != this);\n    let player = state.actors.filter(a => a.type == \"player\").shift();\n    let status = state.status;\n    if (player.slashing) {\n        return new State(state.level, filtered, status);\n    } else { \n        return new State(state.level, state.actors, \"lost\");\n    }\n}\n\n\nconst levelChars = {\n    \".\": \"empty\",\n    \"#\": \"wall\",\n    \"|\": \"invisibleWall\",\n    \"+\": \"lava\",\n    \"~\": \"lavaTop\",\n    \"d\": Door,\n    \"e\": Enemy,\n    \"@\": Player\n};\n\n\nclass Level {\n\n    constructor(plan) {\n        let rows = plan.trim().split(\"/\").map(l => [...l]);\n        this.height = rows.length;\n        this.width = rows[0].length;\n        this.startActors = [];\n\n        this.rows = rows.map((row, y) => {\n            return row.map((ch, x) => {\n                let type = levelChars[ch];\n                if (typeof type === \"string\") return type;\n\n                if (typeof type == \"object\" && type.type() == \"door\") {\n                    this.startActors.unshift(\n                        type.create(new Vector(x, y), ch)\n                    );\n                } else {\n                this.startActors.push(\n                    type.create(new Vector(x, y), ch));\n                }\n                return \"empty\";\n            });\n        });\n    }\n}\n\nclass State {\n\n    constructor(level, actors, status) {\n        this.level = level;\n        this.actors = actors;\n        this.status = status;\n    }\n\n    static start(level) {\n        return new State(level, level.startActors, \"playing\");\n    }\n\n    get player() {\n        return this.actors.find(a => a.type == \"player\");\n    }\n}\n\n// helper method to create an element and give it attributes + child nodes\n\nfunction createElementHelper(name, attrs, ...children) {\n    let dom = document.createElement(name);\n    for (let attr of Object.keys(attrs)) {\n        dom.setAttribute(attr, attrs[attr]);\n    }\n    for (let child of children) {\n        dom.appendChild(child);\n    }\n    return dom;\n}\n\nconst scale = 64;\n\nfunction drawGrid(level) {\n    return createElementHelper(\"table\", {\n        class: \"background\",\n        style: `width: ${level.width * scale}px`\n    }, ...level.rows.map(row =>\n        createElementHelper(\"tr\", { style: `height: ${scale}px` },\n            ...row.map(type => createElementHelper(\"td\", { class: type })))\n    ));\n}\n\nfunction drawActors(actors) {\n    return createElementHelper(\"div\", {}, ...actors.map(actor => {\n        let rect = createElementHelper(\"div\", { class: `actor ${actor.type}` });\n        rect.style.width = `${actor.size.x * scale}px`;\n        rect.style.height = `${actor.size.y * scale}px`;\n        rect.style.left = `${actor.pos.x * scale}px`;\n        rect.style.top = `${actor.pos.y * scale}px`;\n        return rect;\n    }));\n}\n\nLevel.prototype.touches = function (pos, size, type) {\n    var xStart = Math.floor(pos.x);\n    var xEnd = Math.ceil(pos.x + size.x);\n    var yStart = Math.floor(pos.y);\n    var yEnd = Math.ceil(pos.y + size.y);\n\n    for (var y = yStart; y < yEnd; y++) {\n        for (var x = xStart; x < xEnd; x++) {\n            let isOutside = x < 0 || x >= this.width ||\n                y < 0 || y >= this.height;\n            let here = isOutside ? \"wall\" : this.rows[y][x];\n            if (here == type) return true;\n        }\n    }\n    return false;\n};\n\n\nState.prototype.update = function (time, keys) {\n    let actors = this.actors\n        .map(actor => actor.update(time, this, keys));\n    let newState = new State(this.level, actors, this.status);\n\n    if (newState.status != \"playing\") return newState;\n\n    let player = newState.player;\n    if (this.level.touches(player.pos, player.size, \"lava\")) {\n        return new State(this.level, actors, \"lost\");\n    }\n\n    if (this.level.touches(player.pos, player.size, \"lavaTop\")) {\n        return new State(this.level, actors, \"lost\");\n    }\n\n    for (let actor of actors) {\n        if (actor != player && overlap(actor, player)) {\n            newState = actor.collide(newState);\n        }\n    }\n    return newState;\n};\n\nDoor.prototype.collide = function(state) {\n    return new State(state.level, state.actors, \"won\");\n};\n\nfunction overlap(actor1, actor2) {\n    return actor1.pos.x + actor1.size.x > actor2.pos.x &&\n        actor1.pos.x < actor2.pos.x + actor2.size.x &&\n        actor1.pos.y + actor1.size.y > actor2.pos.y &&\n        actor1.pos.y < actor2.pos.y + actor2.size.y;\n}\n\nconst playerXSpeed = 7;\nconst gravity = 30;\nconst jumpSpeed = 11.5;\n\nconst enemyXSpeed = 7;\n\nPlayer.prototype.update = function (time, state, keys) {\n    let xSpeed = 0;\n    let slashing = false;\n    if (keys.a) xSpeed -= playerXSpeed;\n    if (keys.d) xSpeed += playerXSpeed;\n    if (keys.Shift) slashing = true;\n    let pos = this.pos;\n    let movedX = pos.plus(new Vector(xSpeed * time, 0));\n    if (!state.level.touches(movedX, this.size, \"wall\")) {\n        pos = movedX;\n    }\n    let ySpeed = this.speed.y + time * gravity;\n    let movedY = pos.plus(new Vector(0, ySpeed * time));\n\n    if (!state.level.touches(movedY, this.size, \"wall\")) {\n        pos = movedY;\n    } else if (keys.w && ySpeed > 0) {\n        ySpeed = -jumpSpeed;\n    } else {\n        ySpeed = 0;\n    }\n    return new Player(pos, new Vector(xSpeed, ySpeed), slashing);\n};\n\nDoor.prototype.update = function(time) {\n    return new Door(this.pos)\n}\n\nfunction trackKeys(keys) {\n    let down = Object.create(null);\n    function track(event) {\n        if (keys.includes(event.key)) {\n            down[event.key] = event.type == \"keydown\";\n        }\n    }\n    window.addEventListener(\"keydown\", track);\n    window.addEventListener(\"keyup\", track);\n    return down;\n}\n\nconst keys =\n    trackKeys([\"a\", \"d\", \"w\", \"Shift\"]);\n\nfunction runAnimation(frameFunc) {\n    let lastTime = null;\n    function frame(time) {\n        if (lastTime != null) {\n            let timeStep = Math.min(time - lastTime, 100) / 1000;\n            if (frameFunc(timeStep) === false) return;\n        }\n        lastTime = time;\n        requestAnimationFrame(frame);\n    }\n    requestAnimationFrame(frame);\n}\n\nfunction runLevel(level, Display) {\n    let display = new Display(document.body, level);\n    let state = State.start(level);\n    let ending = .5;\n    return new Promise(resolve => {\n        runAnimation(time => {\n            state = state.update(time, keys);\n            display.syncState(state);\n            if (state.status == \"playing\") {\n                return true;\n            } else if (ending > 0) {\n                ending -= time;\n                return true;\n            } else {\n                display.clear();\n                resolve(state.status);\n                return false;\n            }\n        });\n    });\n}\n\nasync function runGame(plans, Display) {\n    for (let level = 0; level < plans.length;) {\n        document.getElementById(\"level\").textContent = `Level: ${level+1}`\n        let status = await runLevel(new Level(plans[level]),\n            Display);\n        if (status == \"won\") {\n            console.log(`You beat level ${level + 1}`);\n            level++;\n        }\n    }\n    let canvasEl = document.createElement(\"canvas\");\n    let parent = document.getElementById(\"canvas-container\");\n    parent.appendChild(canvasEl);\n    canvasEl.width = 950;\n    canvasEl.height = 550;\n    let cx = canvasEl.getContext(\"2d\");\n    cx.fillStyle = \"#FFFFFF\"\n    cx.fillRect(0, 0, 950, 550)\n\n    cx.font = \"50px 'Uncial Antiqua', cursive\";\n    cx.fillStyle = \"#ffd700\";\n    cx.textAlign = \"center\";\n    cx.fillText(\"VICTORY\", 475, 175);\n\n\n    document.getElementById(\"level\").textContent = `You Won! 🎉`\n    console.log(\"You've won!\");\n}\n\n\nclass CanvasDisplay {\n    constructor() {\n        this.canvas = document.createElement(\"canvas\");\n        let parent = document.getElementById(\"canvas-container\");\n        parent.appendChild(this.canvas);\n        this.canvas.width = 950;\n        this.canvas.height = 550;\n\n        this.cx = this.canvas.getContext(\"2d\");\n\n        this.flipPlayer = false;\n\n        this.flipEnemy = false;\n\n        this.viewport = {\n            left: 0,\n            top: 0,\n            width: this.canvas.width / scale,\n            height: this.canvas.height / scale\n        };\n    }\n\n    clear() {\n        this.canvas.remove();\n    }\n}\n\nCanvasDisplay.prototype.syncState = function (state) {\n    this.updateViewport(state);\n    this.clearDisplay(state.status);\n    this.drawBackground(state.level);\n    this.drawActors(state.actors);\n};\n\n\nCanvasDisplay.prototype.updateViewport = function (state) {\n    let view = this.viewport, margin = view.width / 3;\n    let player = state.player;\n    let center = player.pos.plus(player.size.times(0.5));\n\n    if (center.x < view.left + margin) {\n        view.left = Math.max(center.x - margin, 0);\n    } else if (center.x > view.left + view.width - margin) {\n        view.left = Math.min(center.x + margin - view.width,\n            state.level.width - view.width);\n    }\n\n};\n\nCanvasDisplay.prototype.clearDisplay = function (status) {\n    // if (status == \"won\") {\n    //     this.cx.fillStyle = \"rgb(68, 191, 255)\";\n    // } else if (status == \"lost\") {\n    //     this.cx.fillStyle = \"rgb(238, 136, 136)\";  //light red color\n    // } else {\n    //     this.cx.fillStyle = \"rgb(80, 77, 77)\";\n    // }\n    this.cx.fillRect(0, 0,\n        this.canvas.width, this.canvas.height);\n};\n\nlet otherSprites = document.createElement(\"img\");\notherSprites.src = \"background_spritesheet.png\";\n\nlet background = document.createElement(\"img\");\nbackground.src = \"Background.png\";\n\nCanvasDisplay.prototype.drawBackground = function (level) {\n    let { left, top, width, height } = this.viewport;\n    let xStart = Math.floor(left);\n    let xEnd = Math.ceil(left + width);\n    let yStart = Math.floor(top);\n    let yEnd = Math.ceil(top + height);\n\n    this.cx.drawImage(background, 0, 0, 950, 550)\n\n    for (let y = yStart; y < yEnd; y++) {\n        for (let x = xStart; x < xEnd; x++) {\n            let tile = level.rows[y][x];\n            if (tile == \"empty\" || tile == \"invisibleWall\") continue;\n            let screenX = (x - left) * scale;\n            let screenY = (y - top) * scale;\n\n            let tileX;\n\n            if (tile == \"lava\") {\n                tileX = scale\n            } else if (tile == \"lavaTop\") {\n                tileX = scale * 3\n            } else {\n                tileX = 0\n            }\n\n            this.cx.drawImage(otherSprites,\n                tileX, 0, scale, scale,\n                screenX, screenY, scale, scale);\n        }\n    }\n};\n\nfunction flipHorizontally(context, around) {\n    context.translate(around, 0);\n    context.scale(-1, 1);\n    context.translate(-around, 0);\n}\n\nlet playerSprites = document.createElement(\"img\");\nplayerSprites.src = \"spritesheet.png\";\n\nlet slashingSprites = document.createElement(\"img\");\nslashingSprites.src = \"slashing_spritesheet.png\";\n\nconst playerXOverlap = 38;\nconst playerYOverlap = 10;\n\nCanvasDisplay.prototype.drawPlayer = function (player, x, y,\n    width, height) {\n    width += playerXOverlap * 2;\n    height += playerYOverlap\n    x -= playerXOverlap;\n    if (player.speed.x != 0) {\n        this.flipPlayer = player.speed.x < 0;\n    }\n\n    let tile = 8;\n    if (player.speed.y != 0) {\n        tile = 0;\n    } else if (player.speed.x != 0) {\n        tile = Math.floor(Date.now() / 60) % 11;\n    }\n\n    this.cx.save();\n    if (this.flipPlayer) {\n        flipHorizontally(this.cx, x + width / 2);\n    }\n\n    let spriteImg;\n\n    if (player.slashing) {\n        spriteImg = slashingSprites;\n    } else {\n        spriteImg = playerSprites;\n    }\n\n    let tileX = tile * width;\n\n    this.cx.drawImage(spriteImg, tileX, 0, width, height,\n        x, y, width, height);\n    this.cx.restore();\n};\n\nlet enemySprites = document.createElement(\"img\");\nenemySprites.src = \"enemy_spritesheet.png\";\nconst enemyXOverlap = 38;\nconst enemyYOverlap = 10;\n\nCanvasDisplay.prototype.drawEnemy = function (enemy, x, y,\n    width, height) {\n    width += enemyXOverlap * 2;\n    height += enemyYOverlap\n    x -= enemyXOverlap;\n    if (enemy.speed.x != 0) {\n        this.flipEnemy = enemy.speed.x < 0;\n    }\n\n    let tile = 8;\n    if (enemy.speed.y != 0) {\n        tile = 0;\n    } else if (enemy.speed.x != 0) {\n        tile = Math.floor(Date.now() / 60) % 11;\n    }\n\n    this.cx.save();\n    if (this.flipEnemy) {\n        flipHorizontally(this.cx, x + width / 2);\n    }\n    let tileX = tile * width;\n    this.cx.drawImage(enemySprites, tileX, 0, width, height,\n        x, y, width, height);\n    this.cx.restore();\n};\n\n\nCanvasDisplay.prototype.drawActors = function (actors) {\n    for (let actor of actors) {\n        let width = actor.size.x * scale;\n        let height = actor.size.y * scale;\n        let x = (actor.pos.x - this.viewport.left) * scale;\n        let y = (actor.pos.y - this.viewport.top) * scale;\n        if (actor.type == \"player\") {\n            this.drawPlayer(actor, x, y, width, height);\n        } else if (actor.type == \"enemy\") {\n            this.drawEnemy(actor, x, y, width, height);\n        } else {\n            let tileX = (actor.type == \"door\" ? scale * 2 : scale);\n\n            this.cx.drawImage(otherSprites,\n                tileX, 0, width, height,\n                x, y, width, height);\n        }\n    }\n};\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n\n\n    let GAME_LEVELS = [\n        `........................../........................../.........................d/..............####......##/..........##...##......###/@.........##...##....#####/###~~~~~####~~~##~~~~#####/###+++++####+++##++++#####/##########################`, `#########................./#########d|.e........|..../######################..##/.......................###/.......................###/@........####.........####/####~###~####~~####~~#####/####+###+####++####++#####/##########################`, `........................../.|.................e..|.../..####################..../....................##..../#|.e..............|.##..../##################..##...d/....................##~~##/@..................###++##/######################++##`\n    ];\n\n    runGame(GAME_LEVELS, CanvasDisplay);\n\n});\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });