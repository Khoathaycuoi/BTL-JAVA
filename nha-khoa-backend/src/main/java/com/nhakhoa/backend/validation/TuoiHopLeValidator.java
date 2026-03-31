package com.nhakhoa.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class TuoiHopLeValidator implements ConstraintValidator<TuoiHopLe, LocalDate> {
    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext context) {
        if (date == null) return true;
        int year = date.getYear();
        return year >= 1900 && year < 2026;
    }
}