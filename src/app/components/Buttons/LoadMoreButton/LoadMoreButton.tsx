import styles from './style.module.scss';

import type { FC, MouseEventHandler } from 'react';

interface LoadMoreButtonProps {
    text?: string;
    loading?: boolean;
    onLoadMore?: MouseEventHandler<HTMLButtonElement>;
}

const LoadMoreButton: FC<LoadMoreButtonProps> = ({ text = 'Загрузить ещё', loading = false, onLoadMore = () => {} }) => {
    return (
        <>

            <button
                className={styles.btn}
                onClick={onLoadMore} 
                disabled={loading}
            >
                
                {loading && (<div className={styles.loading_placeholder}></div>)}
                {text}
            </button>
        </>
    )
}

export default LoadMoreButton;