var MESSAGES = {
    Data          : 0x00,
    Connection    : 0x01,
    Disconnection : 0x02,

    CameraData : 0x03,
    SceneData : 0x04,
};

var CLIENTS = {
    SendReceive : 0x00,
    Send        : 0x01,
    Receive     : 0x02,
}

exports.MESSAGES = MESSAGES;
exports.CLIENTS = CLIENTS;
