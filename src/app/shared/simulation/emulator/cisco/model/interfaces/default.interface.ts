export interface IDefault {
    setDefaultValues(val: any): void;
    getDefaultValues(): any;
    restoreDefaultValues(props: string[], traverse: boolean): void;
}