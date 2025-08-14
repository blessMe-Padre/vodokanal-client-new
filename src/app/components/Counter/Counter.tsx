'use client';

import { useEffect, useState, useRef } from 'react';

import styles from './style.module.scss';

interface CounterProps {
    endValue: number;
    duration?: number;
    className?: string;
}

export default function Counter({ endValue, duration = 2000, className = '' }: CounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const animateCounter = () => {
            const startTime = Date.now();
            const startValue = 0;
    
            const updateCounter = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
    
                setCount(currentValue);
    
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
    
            requestAnimationFrame(updateCounter);
        };


        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    animateCounter();
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible, endValue, duration]); 

    
    return (
        <span ref={counterRef} className={`${styles.counter} ${className}`}>
            {Intl.NumberFormat('ru-RU').format(count)}
        </span>
    );
} 