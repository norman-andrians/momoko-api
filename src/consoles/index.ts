const getTime = () => {
    const date = new Date();
    const hours: string = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
    const minutes: string = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
    const seconds: string = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();

    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Bat Console, is a betha console logs :///
 */
export class BatConsole {
    public id: number;

    public constructor (id: number) {
        this.id = id;
    }

    public log (...x: any[]) {
        const time = getTime();

        for (let bax of x) {
            console.log(`[${this.id}|${time}]`, bax);
        }
    }
}