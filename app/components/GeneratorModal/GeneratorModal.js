import React from 'react'
import classNames from 'classnames'

// components
import Icon from 'components/Icon/Icon'
import PopupCover from 'components/PopupCover/PopupCover'

const GeneratorModal = ({ children, className, onClose }) => (
	<div className='box-generator-modal-positioning'>
        <div className={classNames('box-generator-modal', className)}>
            {children}
        </div>
		<PopupCover closeHandler={onClose} />
	</div>
)

GeneratorModal.CloseButton = ({ onClick, theme }) => (
	<Icon name="REMOVE" onClick={onClick} className={classNames('box-generator-modal__close', theme)} />
)

export default GeneratorModal
