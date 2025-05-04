import React from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const spinnerVariants = cva('flex-col items-center justify-center', {
    variants: {
        show: {
            true: 'flex',
            false: 'hidden',
        },
    },
    defaultVariants: {
        show: true,
    },
});

const loaderVariants = cva('animate-spin', {
    variants: {
        size: {
            small: 'h-6 w-6',
            medium: 'h-8 w-8',
            large: 'h-12 w-12',
        },
    },
    defaultVariants: {
        size: 'medium',
    },
});

export function Spinner({ size, show, children, className }) {
    return (
        <span className={spinnerVariants({ show })}>
            <Loader2 
                className={`${loaderVariants({ size })} ${className || ''}`} 
                style={{ display: show ? 'block' : 'none' }} 
            />
            {children}
        </span>
    );
}

Spinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    show: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
};

Spinner.defaultProps = {
    size: 'medium',
    show: true
};