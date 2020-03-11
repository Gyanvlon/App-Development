/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

interface JQuery {
    validateCreditCard(options?: any, callback?: Function): any;
}

declare class SmartBanner {
    constructor(object: any)
}