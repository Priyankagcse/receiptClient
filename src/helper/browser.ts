export class Browser {
    static get isDeviceScreen(): boolean {
        return <boolean> (window.innerWidth < 990);
    }
}