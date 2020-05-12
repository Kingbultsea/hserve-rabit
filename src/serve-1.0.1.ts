const _WebSocketServer = require('ws').Server
const fs = require('fs')
const WebSocketServer = new _WebSocketServer({ port: 3009 })
const rml: unique symbol = Symbol('roomLength')

interface MemoryType {
    [key: number]: memoryDataType,
    [rml]: number
}

let memory: MemoryType = {
    [rml]: 10000
}

WebSocketServer.on('connection', async (ws) => {
    console.log('wellCome connect')
    let roomKey = undefined
    let lock: boolean = false // 上锁
    let role: 1 | 2 | 3 | 4 | undefined = undefined
    let AVATAR = 'https://res.psy-1.com/FskrtbwZ59DkAgSDSJPRUEuQXiqy'
    let NAME = 'FFF'

    function upRole(r: role) {
        role = r
    }
    updateRole.push(upRole)
    // let privateKey = undefined
    ws.on('message', (message) => {
        if (lock) {
            return
        }

        // 由于前台不会发送任何其他关于下一轮的信息，所以直接setTimeout 直接锁定3秒
        // 这里前端页面输入也锁定下
        setTimeout(() => {
            lock = false
        }, 3000)

        const data = JSON.parse(message) as MsgFormatter<any>
        if (data.from !== 'client') {
            return
        }

        if (data.data.status === 10000) { // 创建房间
            role = 1

            if (data.data.name) {
                NAME = data.data.name
            }

            if (data.data.avatar) {
                AVATAR = data.data.avatar
            }

            memory[rml]++
            roomKey = memory[rml]
            memory[roomKey] = {
                inlineCount: 1,
                innerWS: [ws],
                members: [
                    {
                        avatar: AVATAR,
                        name: NAME,
                        role
                    }
                ]
            }

            // 要向外给key 加入房间 要对准Key交换数据
            ws.send(messageFormatter(8, {
                members: memory[roomKey].members,
                room: roomKey,
                status: data.data.status
            }))
        }

        if (data.data.status === 10001) { // 加入房间号 需要取得房主roomkey
            console.log('加入房间')
            const roomData = memory[data.data.room]
            roomKey = data.data.room
            if (!roomData) {
                ws.send(messageFormatter(6, {
                }), {}, () => {
                    // ws.close()
                })
                return
            }

            roomData.inlineCount++

            if (roomData.members.length > 4) {
                ws.send(messageFormatter(9, {
                }))
                return
            }

            if (data.data.name) {
                NAME = name
            }

            if (data.data.avatar) {
                AVATAR = data.data.avatar
            }

            // @ts-ignore
            role = roomData.members.length + 1 // 需要加1是因为push前
            roomData.innerWS.push(ws)
            roomData.members.push({
                avatar: AVATAR,
                name: NAME,
                role
            })

            // 广播当前房间信息
            sendClinesRoomData(roomData, roomKey)

            // 要向外给key 加入房间 要对准Key交换数据
            ws.send(messageFormatter(0, {
                room: data.data.room
            }))
        }

        if (data.data.status === 10002) { // 随意进入 需要取得房主roomkey
        }

        // 加载完毕 需要发送初始数据
        if (data.data.status === 10003) {
            // 发送个人信息
            console.log('发送给个人的信息，非广播：' + role)
            ws.send(messageFormatter(2, {
                role: role,
                names: memory[roomKey].members.map(v => v.name)
            }))

            memory[roomKey].load ? memory[roomKey].load.push(true) : memory[roomKey].load = [true]
            console.log('正在加载: ' + memory[roomKey].load.length)
            if (memory[roomKey].load.length === 4) {
                console.log('加载完毕')
                // 加载完毕
                // 初始化serverAction
                memory[roomKey].serverAction = serverActionInit()

                // 广播当前房间数据
                sendActionData(roomKey, role)
            }
        }

        // 开始游戏,广播开始游戏信息
        if (data.data.status === 10004) {
            star(roomKey)
        }

        if (data.data.status === 11000) { // 用户操作交互
            const dataAction: ClientAction = data.data
            if (!memory[roomKey].action) {
                memory[roomKey].action = []
            }
            for (let i = 0; i < memory[roomKey].action.length; i++) {
                if (memory[roomKey].action[i].role === role) {
                    // 已存在
                    return
                }
            }

            memory[roomKey].action.push({
                avatar: AVATAR,
                name: NAME,
                role,
                front: dataAction.front
            })

            console.log(role + '操作', '长度：' + memory[roomKey].action.length)

            if (memory[roomKey].action.length === 4) {
                lock = true // 锁定不接收任何消息
                console.log('长度大于4了')
                // 分数处理 处理serverAction.membersData
                scorePaser(memory[roomKey].action, roomKey)
                memory[roomKey].serverAction.round++
                if (memory[roomKey].serverAction.round > memory[roomKey].serverAction.maxRound) {
                    memory[roomKey].serverAction.done = true
                    // done
                }

                // 刷新气泡
                memory[roomKey].serverAction.blurScore = [
                    randomNum(1, 6),
                    randomNum(1, 6),
                    randomNum(1, 6),
                    randomNum(1, 6),
                    randomNum(1, 6)
                ]

                    // 广播当前房间数据
                sendActionData(roomKey, role)
                // memory[roomKey].historyAction.push(memory[roomKey].action)
                memory[roomKey].action = []
            }
        }

        // 聊天输入
        if (data.data.status === 11009) {
            if (!memory[roomKey].chartMsg) {
                memory[roomKey].chartMsg = []
            }
            memory[roomKey].chartMsg.push({
                msg: data.data.msg,
                avatar: AVATAR,
                name: NAME
            })

            // 广播 广播完后将清空 因为是新的消息
            sendChartData(roomKey)
        }
    })

    ws.on('close', (ws) => {
        const roomData = memory[roomKey]

        if (!roomData) {
            return
        }

        if (roomData && (roomData.inlineCount || roomData.inlineCount === 0)) {
            roomData.inlineCount--
        }
        // console.log('用户退出', roomData?.serverAction?.done)

        if (roomData && roomData.serverAction) {
            if (memory[roomKey]) {
                delete memory[roomKey]
                updateRole = []
            }
            // 广播 + close
            roomData.innerWS.forEach((v: any) => {
                v.send(messageFormatter(1, {
                    room: roomKey
                }), {}, () => {
                    v.close()
                })
            })
            return
        }
        // done游戏结束 可以删除数据了 且没有人在房间
        if (roomData?.serverAction?.done && roomData.inlineCount <= 0) {
            if (memory[roomKey]) {
                delete memory[roomKey]
                updateRole = []
            }
            return
        }

        // 如果有该房间那么删除指引
        if (role === 1) {
            if (memory[roomKey]) {
                delete memory[roomKey]
                updateRole = []
            }
            roomData.innerWS.splice(0, 1)
            // 广播 + close
            roomData.innerWS.forEach((v: any) => {
                v.send(messageFormatter(7, {
                    room: roomKey
                }), {}, () => {
                    v.close()
                })
            })
            return
        }
        if (typeof role === 'number' && roomData) {
            // 删除缓存
            roomData.innerWS.splice(role - 1, 1)
            roomData.members.splice(role - 1, 1)
            updateRole.splice(role - 1, 1)

            console.log('???', JSON.stringify(roomData.members))
            roomData.members.forEach((v, index: role) => {
                updateRole[index](index + 1)
                v.role = index + 1 as role
            })

            // 广播当前房间信息
            sendClinesRoomData(roomData, roomKey)
        }
    })
})

let updateRole: any = []

function messageFormatter(status = 0, data: any = '') {
    return JSON.stringify({
        from: 'server',
        status,
        data
    } as MsgFormatter<any>)
}

function sendClinesRoomData(roomData, roomKey) {
    // 广播当前房间信息
    roomData.innerWS.forEach((v: any) => {
        v.send(messageFormatter(8, {
            room: roomKey,
            members: memory[roomKey].members
        }))
    })
}

function serverActionInit(): serverAction {
    const data: serverAction = {
        round: 1,
        maxRound: 5,
        done: false,
        blurScore: [
            randomNum(1, 6),
            randomNum(1, 6),
            randomNum(1, 6),
            randomNum(1, 6),
            randomNum(1, 6)
        ]
    }
    return data
}

function randomNum(minNum: number, maxNum: number): number {
    switch (arguments.length) {
        case 1:
            return parseInt((Math.random() * minNum + 1).toString(), 10)
        case 2:
            return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toString(), 10)
        default:
            return 0
    }
}

// 用户输入结果处理
function scorePaser(actions: sgAction[], roomKey) {
    const blurScore = memory[roomKey].serverAction.blurScore // 1 2 3 4 down+3 left-1 right+1 up-3
    const membersData: {
        avatar: string,
        name: string
        toPosition: number,
        front: Front,
        score: number,
        role: role,
        fail: boolean
    }[] = []
    for (let i = 0; i < actions.length; i++) {
        const pi = calculatedPosition(actions[i])
        console.log('pi: ' + pi)

        // ²计算 冲突可以做一次i j记录 直接跳过循环
        for (let j = 0; j < actions.length; j++) {

            const pj = calculatedPosition(actions[j])
            console.log('pj: ' + pj)
            // 位置冲突碰撞 不得分
            if (pi === pj && i !== j) { // i !== j 排除自己
                membersData.push({
                    avatar: actions[i].avatar,
                    name: actions[i].name,
                    toPosition: pi / 2,  // 0 2 4 6 8 -> 0 1 2 3 4
                    front: actions[i].front,
                    score: 0,
                    role: actions[i].role,
                    fail: true
                })
                break
            }

            // 进行到最后一个就是没有冲突
            if (j === actions.length - 1) {
                membersData.push({
                    avatar: actions[i].avatar,
                    name: actions[i].name,
                    toPosition: pi / 2,  // 0 2 4 6 8 -> 0 1 2 3 4
                    front: actions[i].front,
                    score: blurScore[(pi / 2)], // 0 2 4 6 8 -> 0 1 2 3 4
                    role: actions[i].role,
                    fail: false
                })
            }
        }
    }

    console.log(
        '服务器计算出的MembersData（一轮）' + JSON.stringify(membersData)
    )

    // 添加修改数据 memory[roomKey].serverAction.membersData
    if (memory[roomKey].serverAction.membersData) {
        for (let i = 0; i < memory[roomKey].serverAction.membersData.length; i++) {
            for (let j = 0; j < membersData.length; j++) {
                const m1 = memory[roomKey].serverAction.membersData[i]
                const m2 = membersData[j]
                if (m1.role === m2.role) {
                    m1.score += m2.score
                    m1.fail = m2.fail
                    m1.front = m2.front
                    m1.toPosition = m2.toPosition
                    break
                }
            }
        }
    } else {
        // 进行排序
        memory[roomKey].serverAction.membersData = membersData.sort((a, b) => {
            return a.role - b.role
        })
    }
}

function calculatedPosition(action: sgAction): number {
    const front = action.front
    // 1 3 5 7
    let position = front === 'right'
        ? ((action.role * 2) - 1 + 1)
        : front === 'down'
            ? ((action.role * 2) - 1 + 3)
            : front === 'left'
                ? ((action.role * 2) - 1 - 1)
                : front === 'up'
                    ? ((action.role * 2) - 1 - 3)
                    : 99999 // 不存在的！
    return position
}

function star(roomKey) {
    // 广播游戏信息
    memory[roomKey].innerWS.forEach((v: any) => {
        v.send(messageFormatter(4, {
        }))
    })
}

function sendActionData(roomKey, role: number) {
    if (memory[roomKey]) {
        console.log(
            '广播当前房间数据:' + JSON.stringify(memory[roomKey].serverAction)
        )
        // 广播游戏信息
        memory[roomKey].innerWS.forEach((v: any, index: number) => {
            v.send(messageFormatter(5, {
                role: index, // 当前角色
                serverAction: memory[roomKey].serverAction
            }))
        })
    }
}

function sendChartData(roomKey) {
    // 广播聊天信息
    memory[roomKey].innerWS.forEach((v: any) => {
        v.send(messageFormatter(3, {
            chartMsg: memory[roomKey].chartMsg
        }))
    })
    memory[roomKey].chartMsg = []
}

//tsnd --respawn ./src/serve-1.0.1.ts
