export interface AnimateElementProps {
    element: keyof React.JSX.IntrinsicElements;
    animationName?: string;
    animationDelay?: number;
    className?: string;
    children?: React.ReactNode;
}
