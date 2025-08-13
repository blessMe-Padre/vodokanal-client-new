export interface AnimateElementProps {
    element: keyof React.JSX.IntrinsicElements;
    animationName?: string;
    className?: string;
    content?: React.ReactNode;
}
