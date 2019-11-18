import atob from 'atob'

export class Tool {
    randomNum(minNum: number, maxNum: number): number {
        switch (arguments.length) {
            case 1:
                return parseInt(String(Math.random() * minNum + 1), 10)
            case 2:
                return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10)
            default:
                return 0
        }
    }

    base64deCode (str: string) {
        return decodeURIComponent(atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }
}
