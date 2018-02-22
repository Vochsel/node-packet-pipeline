# node-packet-pipeline
A simple setup to allow data to be transferred between clients via a lightweight server. 


## Server / Client Architecture
Clients of this system can register as a sender, receiver, or both. Receivers can send extra data to whitelist certain senders, the default is to receive all packages.

## Message Architecture
Messages are sent encoded as bits, the first 2 bits of any message defines the type of message

00 - Data Message
01 - Connection Message
10
11