// ============================================================
// useCarousel.js — Auto-sliding carousel logic er custom hook
// Timer base logic use kore slide change korar jonno.
// Next, Prev, r specific index set korar functions provide kore.
// Landing page er HeroCarousel e eta use kora hoyeche.
// ============================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage auto-sliding carousel state and logic
 * @param {number} length - The total number of items in the carousel
 * @param {number} interval - The interval in milliseconds for auto-sliding (default: 2000)
 * @returns {object} - Returns current index, next/prev functions, and direct set function
 */
export const useCarousel = (length, interval = 2000) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % length);
    }, [length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + length) % length);
    }, [length]);

    const setIndex = useCallback((index) => {
        if (index >= 0 && index < length) {
            setCurrentIndex(index);
        }
    }, [length]);

    useEffect(() => {
        if (length === 0) return;
        
        const timer = setInterval(() => {
            next();
        }, interval);
        
        return () => clearInterval(timer);
    }, [length, interval, next]);

    return {
        currentIndex,
        next,
        prev,
        setIndex
    };
};
