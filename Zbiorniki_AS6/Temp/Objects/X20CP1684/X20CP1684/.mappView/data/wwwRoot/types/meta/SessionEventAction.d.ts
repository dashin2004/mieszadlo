/*
Attention: this file is created via transformation from definition file in folder /EventsActions.
To make changes, change the source file! 
*/

interface sessionBoolean_EventAction {
    /**
    * Sets the value of a variable to a boolean value.
    */
    setValueBool(value:boolean): void;

    /**
    * Switches variable value to its opposite boolean value.
    */
    toggleValueBool(): void;

    /**
    * Provides the value of the referenced variable.
    */
    getValue(): Promise<boolean>;

    /**
    * Triggered if the value of the variable changes.
    */
    valueChanged(handler: (e: { detail: { newValue:boolean, oldValue:boolean } }) => void): void;

}
interface sessionNumeric_EventAction {
    /**
    * Sets the value of a variable to a numeric value.
    */
    setValueNumber(value:number): void;

    /**
    * Adds a value to the current value of a numeric variable.
    */
    addValue(value:number): void;

    /**
    * Provides the value of the referenced variable.
    */
    getValue(): Promise<number>;

    /**
    * Triggered if the value of the variable changes.
    */
    valueChanged(handler: (e: { detail: { newValue:number, oldValue:number } }) => void): void;

}
interface sessionString_EventAction {
    /**
    * Sets the value of a variable to a string value.
    */
    setValueString(value:string): void;

    /**
    * Provides the value of the referenced variable.
    */
    getValue(): Promise<string>;

    /**
    * Triggered if the value of the variable changes.
    */
    valueChanged(handler: (e: { detail: { newValue:string, oldValue:string } }) => void): void;

}
interface sessionDateTime_EventAction {
    /**
    * Sets the value of a variable to a DateTime value.
    */
    setValueDateTime(value:DateTime): void;

    /**
    * Provides the value of the referenced variable.
    */
    getValue(): Promise<DateTime>;

    /**
    * Triggered if the value of the variable changes.
    */
    valueChanged(handler: (e: { detail: { newValue:DateTime, oldValue:DateTime } }) => void): void;

}
interface sessionTimer_EventAction {
    /**
    * This action is used to start the timer interval.
    */
    start(interval?:IntervalType): void;

    /**
    * This action is used to stop the timer interval.
    */
    stop(): void;

    /**
    * Returns the current status of the referenced timer.
    */
    isRunning(): Promise<boolean>;

    /**
    * Triggered when the interval of the timer elapses.
    */
    elapsed(handler: () => void): void;

}
