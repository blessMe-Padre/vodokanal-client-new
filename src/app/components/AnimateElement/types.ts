export interface AnimateElementProps {
    element: keyof React.JSX.IntrinsicElements;
    animationName?: string;
    animationDelay?: string;
    className?: string;
    children?: React.ReactNode;
}
