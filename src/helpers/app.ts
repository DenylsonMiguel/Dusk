class App {
    public log(message: string) {
        console.log(`[LOG] - ${message}`);
    }

    public error(message: string) {
        console.error(`[ERROR] - ${message}`);
    }
}
const app = new App();

export default app;
