'use client'
import { useEffect, useState, useRef } from 'react';

import styles from "./style.module.scss";
import { AnimateElementProps } from './types';

/**
 * TODO:
 * - Добавить задержку анимации
 * - Добавить children для элемента
 */

/**
 * @param element - html тег, который будет анимирован
 * @param animationName - имя анимации (fadeUp, fadeDown, fadeLeft, fadeRight)
 * @param className - добавить класс для элемента
 * @param content - контент для элемента
 * @returns html тег с анимацией
 */

  
  const AnimateElement: React.FC<AnimateElementProps> = ({
    element,
    animationName = styles.fadeUp,
    className,
    content,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
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
            elementRef.current?.classList.add('active');
          }
        },
        { threshold: 0.2 }
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      return () => observer.disconnect();
    }, [isVisible]);
  
    const Tag = element as React.ElementType;
  
    return (
      <Tag
        ref={elementRef}
        className={`${className} ${animationName} ${isVisible ? styles.active : ''}`}
      >
        {content}
      </Tag>
    );
  };

  export default AnimateElement;