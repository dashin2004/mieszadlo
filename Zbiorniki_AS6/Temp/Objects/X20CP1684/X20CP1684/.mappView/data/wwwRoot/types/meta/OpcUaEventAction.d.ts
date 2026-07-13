/*
Attention: this file is created via transformation from definition file in folder /EventsActions.
To make changes, change the source file! 
*/

interface opcUa_EventAction {
    /**
    * Sets the "value" attribute of an OpcUa node to a boolean value.
    */
    setValueBool(value:boolean): Promise<void>;

    /**
    * Switches OpcUa node attribute "value" to its opposite boolean value.
    */
    toggleValueBool(): Promise<void>;

    /**
    * Sets node OpcUa attribute "value" to a numeric value.
    */
    setValueNumber(value:number): Promise<void>;

    /**
    * Adds a value to the current value of OpcUa node attribute "value".
    */
    addValue(value:number): Promise<void>;

    /**
    * Sets OpcUa node attribute "value" to a string value.
    */
    setValueString(value:string): Promise<void>;

    /**
    * Sets OpcUa node attribute "value" to a DateTime value.
    */
    setValueDateTime(value:DateTime): Promise<void>;

    /**
    * Provides the value of attribute "value" for the referenced OpcUa node. For the meaning of the values, please refer to the help.
    */
    getValue(): Promise<any>;

    /**
    * Triggered if the value of the OpcUa node changes.
    */
    valueChanged(handler: (e: { detail: { newValue:any, oldValue:any } }) => void): void;

}
interface opcUaSystem_EventAction {
    /**
    * Returns the current state of an OPC UA server connection as an enumeration value.
    */
    getServerStatus(serverAlias?:string): Promise<Integer>;

    /**
    * Fired when the OPC UA server has connected.
    */
    connected(handler: (e: { detail: { serverAlias:string, timestamp:DateTime } }) => void): void;

    /**
    * Fired when the OPC UA server has disconnected.
    */
    disconnected(handler: (e: { detail: { serverAlias:string, timestamp:DateTime } }) => void): void;

}
