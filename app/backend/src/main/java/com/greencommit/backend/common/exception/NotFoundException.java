package com.greencommit.backend.common.exception;

/** 요청한 리소스(User/Repository/Issue/JourneySession 등)가 없을 때 던지는 공통 예외. */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
