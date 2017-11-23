import React from 'react';
import classNames from 'classnames';

export default ({ children, className, disabled, closeHandler }) => (
    <div onClick={closeHandler} className={classNames({"box-popup-cover" : !disabled}, className)}>
        {children}
    </div>
)