'use client'
import { useEffect, useState, useRef } from 'react';

import styles from "./style.module.scss";
import { AnimateElementProps } from './types';

/**
 * TODO:
 * - Добавить children для элемента
 */

/**
 * @param string element - html тег, который будет анимирован
 * @param string animationName - имя анимации (fadeUp, fadeDown, fadeLeft, fadeRight)
 * @param number animationDelay - задержка анимации (ms) 1000 = 1s
 * @param string className - добавить класс для элемента
 * @returns html тег с анимацией
 */

  
  const AnimateElement: React.FC<AnimateElementProps> = ({
    element,
    animationName = styles.fadeUp,
    animationDelay = 100,
    className,
    children,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    switch (animationName) {
        case 'fadeUp':
            animationName = styles.fadeUp;
            break;
        case 'fadeRight':
            animationName = styles.fadeRight;
            break;
        case 'fadeLeft':
            animationName = styles.fadeLeft;
            break;
        case 'fadeDown':
            animationName = styles.fadeDown;
            break;
        default:
            animationName = styles.fadeUp;
            break;
    }
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            
            // Применяем задержку анимации
            if (animationDelay > 0) {
              setTimeout(() => {
                setIsAnimationStarted(true);
                elementRef.current?.classList.add('active');
              }, animationDelay);
            } else {
              setIsAnimationStarted(true);
              elementRef.current?.classList.add('active');
            }
          }
        },
        { threshold: 0.2 }
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      return () => observer.disconnect();
    }, [isVisible, animationDelay]);
  
    const Tag = element as React.ElementType;
  
    return (
      <Tag
        ref={elementRef}
        className={`${className} ${animationName} ${isAnimationStarted ? styles.active : ''}`}
        style={{
          '--animation-delay': `${animationDelay}ms`
        } as React.CSSProperties}
      >
        {children}
      </Tag>
    );
  };

  export default AnimateElement;