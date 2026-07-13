/*
Attention: this file is created via transformation from definition file in folder /EventsActions.
To make changes, change the source file! 
*/

interface clientSystem_EventAction {
    /**
    * This action opens a dialog box.
    */
    openDialog(dialogId:DialogReference, mode?:brease_enum_DialogMode, horizontalPos?:HPos, verticalPos?:VPos, headerText?:string, autoClose?:boolean, autoRaise?:brease_enum_AutoRaise): void;

    /**
    * This action closes a previously opened dialog box.
    */
    closeDialog(dialogId:DialogReference): void;

    /**
    * This action switches to another page.
    */
    navigate(pageId:PageReference): void;

    /**
    * This action loads a piece of content to an area.
    */
    loadContentInArea(contentId:ContentReference, areaId:AreaReference, pageId:PageReference): Promise<boolean>;

    /**
    * This action loads a piece of content to an area of a dialog.
    */
    loadContentInDialogArea(contentId:ContentReference, areaId:AreaReference, dialogId:DialogReference): Promise<boolean>;

    /**
    * This action switches to another theme.
    */
    changeTheme(theme:ThemeReference): void;

    /**
    * This action switches the language.
    */
    setLanguage(value:string): void;

    /**
    * This action switches the unit system.
    */
    setMeasurementSystem(value:brease_enum_MeasurementSystem): void;

    /**
    * This action is used for scrolling large content referenced in a smaller area of a layout.
    */
    scrollContent(contentId:ContentReference, position:brease_enum_ScrollDirection, duration?:UInteger): Promise<boolean>;

    /**
    * This action opens a specified dialog box positioned relative to a specified widget.
    */
    openDialogAtTarget(dialogId:DialogReference, target:CombinedContentWidgetId, mode?:brease_enum_DialogMode, horizontalPos?:brease_enum_HorizontalPosition, verticalPos?:brease_enum_VerticalPosition, headerText?:string, autoClose?:boolean, horizontalDialogAlignment?:brease_enum_HorizontalPosition, verticalDialogAlignment?:brease_enum_VerticalPosition, autoRaise?:brease_enum_AutoRaise): void;

    /**
    * This action displays a message box.
    */
    showMessageBox(type:brease_enum_MessageBoxType, message:string, header:string, icon?:brease_enum_MessageBoxIcon, style?:StyleReference): Promise<Integer>;

    /**
    * This action is used to log in a certain user.
    */
    login(userName:string, password:string): Promise<boolean>;

    /**
    * This action logs out to the default user.
    */
    logout(): void;

    /**
    * This action opens a dialog to allow the user to change password.
    */
    openChangePasswordDialog(userName?:string, showPolicy?:boolean): void;

    /**
    * This action enables or disables the tooltip mode for the visualization.
    */
    showTooltips(value:boolean): void;

    /**
    * This action changes the password of the defined user.
    */
    changePassword(oldPassword:string, newPassword:string, userName?:string): Promise<Integer>;

    /**
    * This action moves the focus to the next widget.
    */
    focusNext(): void;

    /**
    * This action moves the focus to the previous widget.
    */
    focusPrevious(): void;

    /**
    * This action takes a screenshot and stores it on the client.
    */
    saveScreenshotOnClient(fileName?:FileName): Promise<boolean>;

    /**
    * This action takes a screenshot and stores it on the server (file device).
    */
    saveScreenshotToServer(fileDevice:FilePath, fileName?:FileName): Promise<boolean>;

    /**
    * Triggered when keyboard input is pressed.
    */
    keyDown(handler: (e: { detail: { keyASCII:string, key:string } }) => void): void;

    /**
    * Triggered when keyboard input is released.
    */
    keyUp(handler: (e: { detail: { keyASCII:string, key:string } }) => void): void;

    /**
    * Triggered after keyboard input is completed.
    */
    keyPress(handler: (e: { detail: { keyASCII:string, key:string } }) => void): void;

    /**
    * Fired when a login was successful.
    */
    loginSuccess(handler: () => void): void;

    /**
    * Fired when a login failed.
    */
    loginFailed(handler: () => void): void;

    /**
    * Triggered by the two-finger swipe gesture.
    */
    systemSwipe(handler: (e: { detail: { direction:string, areaId:string } }) => void): void;

    /**
    * Fired when a content was loaded.
    */
    contentLoaded(handler: (e: { detail: { contentId:string, visuId:string } }) => void): void;

    /**
    * Triggered when the user wants to interact with an inactive widget.
    */
    disabledClick(handler: (e: { detail: { contentId:string, widgetId:string, hasPermission:boolean } }) => void): void;

    /**
    * Triggered after a dialog has opened and the content contained in it has been loaded.
    */
    dialogOpened(handler: (e: { detail: { dialogId:string } }) => void): void;

    /**
    * Triggered after a dialog has been closed.
    */
    dialogClosed(handler: (e: { detail: { dialogId:string } }) => void): void;

    /**
    * Triggered when the tooltip mode is activated.
    */
    tooltipModeActivated(handler: () => void): void;

    /**
    * Triggered when the tooltip mode is deactivated.
    */
    tooltipModeDeactivated(handler: () => void): void;

    /**
    * Triggered when the user was logged out by the system.
    */
    loggedOut(handler: (e: { detail: { userName:string, reason:Integer } }) => void): void;

    /**
    * Triggered when a login failed due to an expired password.
    */
    passwordChangeRequired(handler: (e: { detail: { userName:string } }) => void): void;

    /**
    * Triggered when a password change via the ChangePasswordDialog is finished.
    */
    changePasswordDialogClosed(handler: (e: { detail: { userName:string, result:Integer } }) => void): void;

    /**
    * Triggered at login or while a user is logged in, when the password expire notification time is reached.
    */
    passwordExpireNotification(handler: () => void): void;

}
