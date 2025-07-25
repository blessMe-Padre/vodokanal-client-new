import Image from 'next/image';
import React from 'react';

import styles from './style.module.scss';

export type ContentItem = {
    type: string;
    children: ContentItem[];
    level?: number;
    format?: string;
    text?: string;
    image?: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTagType = `h${HeadingLevel}`;
type ListTagType = 'ul' | 'ol';

export interface ContentRendererProps {
    content: ContentItem[];
}

export const renderContent = (content: ContentItem[]): React.ReactNode => {
    return content.map((item, index) => {
        switch (item.type) {
            case 'heading': {
                const HeadingTag = `h${item.level}` as HeadingTagType;
                return (
                    <HeadingTag key={index} className={styles.title}>
                        {item.children.map((child, childIndex) => (
                            <React.Fragment key={childIndex}>
                                {renderContent([child])}
                            </React.Fragment>
                        ))}
                    </HeadingTag>
                );
            }
            case 'paragraph':
                return (
                    <p className={styles.p} key={index}>
                        {item.children.map((child, childIndex) => (
                            <React.Fragment key={childIndex}>
                                {renderContent([child])}
                            </React.Fragment>
                        ))}
                    </p>
                );
            case 'list': {
                const ListTag: ListTagType = item.format === 'unordered' ? 'ul' : 'ol';
                return (
                    <ListTag className={styles.ul} key={index}>
                        {item.children.map((child, childIndex) => (
                            <React.Fragment key={childIndex}>
                                {renderContent([child])}
                            </React.Fragment>
                        ))}
                    </ListTag>
                );
            }
            case 'list-item':
                return (
                    <li className={styles.li} key={index} >
                        {item.children.map((child, childIndex) => (
                            <React.Fragment key={childIndex}>
                                {renderContent([child])}
                            </React.Fragment>
                        ))}
                    </li>
                );
            case 'text':
                return <React.Fragment key={index}>{item.text}</React.Fragment>;
            case 'image':
                if (!item.image) return null;
                return (
                    <div className={styles.imageWrapper} key={index}>
                        <a href={item.image.url} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={item.image.url}
                                alt={item.image.alternativeText || "image"}
                                width={item.image.width || 500}
                                height={item.image.height || 300}
                                loading="lazy"
                            />
                        </a>
                    </div>
                );
            default:
                return null;
        }
    });
};

export default function ContentRenderer({ content }: ContentRendererProps) {
    return <div>{renderContent(content)}</div>;
};

