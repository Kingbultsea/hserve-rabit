interface MsgFormatter<type> {
    from: 'client' | 'server'
    data: type,
    status: number // 服务器的 0成功 9饱满 8广播房间信息 7房主解散房间 6房间不存在
    // 5服务器游戏交互操作 4开始游戏 3收到聊天信息 2发送个人信息 1玩家离开游戏结束
}

// 用户传入的data
interface ClientData {
    status: number, // 10000创建房间 10001加入房间号 10002随机进入 10004开始游戏 10003开始游戏并加载完毕
    // 11000操作输入 11009聊天信息输入
    room?: number, // 房间号 直接是进入的密钥了 到时候可以高级点，来个非对称加密
}

// 用户传入的数据
interface ClientAction {
    status: 11000, // 操作输入
    front: Front, // 方向
}

// 服务端的数据操作交互
interface serverAction {
    round: number, // 当前进行的回合
    maxRound: number, // 总回合数
    membersData?: {
        avatar: string,
        name: string,
        toPosition: number, // 将要去的气泡地方为index toPosition: pi / 2,  // 0 2 4 6 8 -> 0 1 2 3 4
        score: number,
        front: Front,
        role: role,
        fail: boolean
    }[], // 获得的分数
    blurScore?: [number, number, number, number, number] // 下一轮的位置气泡数 最小为1 最大为6
    done: boolean // 是否结束
}

interface MemberMsg {
    avatar: string,
    name: string,
    role: role
}

interface sgAction {
    avatar: string,
    name: string,
    role: role,
    front: Front
}


interface memoryDataType {
    inlineCount: number,
    chartMsg?: chartMsgType[],
    innerWS?: WebSocket[],
    members?: MemberMsg[],
    historyAction?: sgAction[][],
    load?: any[],
    action?: sgAction[],
    serverAction?: serverAction
}

interface chartMsgType {
    avatar: string,
    name: string,
    msg: string
}

type role =  1 | 2 | 3 | 4 | undefined  // 1为第一位 2为第二位 3为第三位 4为第四位
type Front = 'up' | 'down' | 'left' | 'right'
