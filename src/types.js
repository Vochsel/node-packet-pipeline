var MESSAGE_TYPE = {
    Data          : 0x00,
    Connection    : 0x01,
    Disconnection : 0x02
};

var CLIENT_TYPE = {
	SendReceive : 0x00,
    Send        : 0x01,
    Receive    	: 0x02
};

exports.MESSAGE_TYPE = MESSAGE_TYPE;
exports.CLIENT_TYPE = CLIENT_TYPE;