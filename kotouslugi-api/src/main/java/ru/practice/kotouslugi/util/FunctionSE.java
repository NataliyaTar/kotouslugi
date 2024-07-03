package ru.practice.kotouslugi.util;

import ru.practice.kotouslugi.exception.ServiceException;

@FunctionalInterface
public interface FunctionSE<T>  {
    T apply(T t) throws ServiceException;
}

