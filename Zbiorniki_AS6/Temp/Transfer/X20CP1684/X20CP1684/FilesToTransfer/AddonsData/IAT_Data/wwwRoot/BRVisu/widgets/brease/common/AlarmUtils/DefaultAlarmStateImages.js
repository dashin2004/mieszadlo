'use strict';
define(function () {
    // Maps a property name derived from the AlarmState to a default image
    const DefaultAlarmStateImages = new Map();
    const imagePath = 'widgets/brease/AlarmList/assets/';
    DefaultAlarmStateImages.set('imageActive', `${imagePath}act_nack.svg`);
    DefaultAlarmStateImages.set('imageActiveAcknowledged', `${imagePath}act_ack.svg`);
    DefaultAlarmStateImages.set('imageInactive', `${imagePath}nact_nack.svg`);

    DefaultAlarmStateImages.set('imageInactiveUnconfirmed', `${imagePath}nact_nack_ncon.svg`);
    DefaultAlarmStateImages.set('imageActiveUnconfirmed', `${imagePath}act_nack_ncon.svg`);
    DefaultAlarmStateImages.set('imageInactiveAcknowledgedUnconfirmed', `${imagePath}nact_ack_ncon.svg`);
    DefaultAlarmStateImages.set('imageActiveAcknowledgedUnconfirmed', `${imagePath}act_ack_ncon.svg`);
    DefaultAlarmStateImages.set('imageInactiveConfirmed', `${imagePath}nact_nack_con.svg`);
    DefaultAlarmStateImages.set('imageActiveConfirmed', `${imagePath}act_nack_con.svg`);
    DefaultAlarmStateImages.set('imageInactiveAcknowledgedConfirmed', `${imagePath}nact_ack_con.svg`);
    DefaultAlarmStateImages.set('imageActiveAcknowledgedConfirmed', `${imagePath}act_ack_con.svg`);

    return DefaultAlarmStateImages;

});
