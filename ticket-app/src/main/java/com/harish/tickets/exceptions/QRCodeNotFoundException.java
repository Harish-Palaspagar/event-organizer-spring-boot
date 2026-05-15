package com.harish.tickets.exceptions;

public class QRCodeNotFoundException extends EventTicketException {

    public QRCodeNotFoundException() {
    }

    public QRCodeNotFoundException(String message) {
        super(message);
    }

    public QRCodeNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public QRCodeNotFoundException(Throwable cause) {
        super(cause);
    }

    public QRCodeNotFoundException(String message, Throwable cause, boolean enableSuppression,
                                   boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
