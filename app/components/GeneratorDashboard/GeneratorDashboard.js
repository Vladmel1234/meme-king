import _ from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'

// components
import Button from '../GeneratorDashboardButton/GeneratorDashboardButton'
import ItemsArea from '../ItemsArea/ItemsArea'
import GeneratorUploader from '../GeneratorUploader/GeneratorUploader'
import TextFieldsContainer from 'components/TextFieldsContainer/TextFieldsContainer'
import GeneratorSignature from 'components/GeneratorSignature/GeneratorSignature'
import Modal from 'components/Modal/Modal'

// services
import LocalStorageService from 'services/LocalStorage'
import AnalyticsService from 'services/Analytics'
import WebViewService from 'services/webViewService';

// helpers
import helpers from 'helpers/helpers'

// constants
import globalConstants from 'constants/global'

export default class GeneratorDashboard extends Component {

    state = {
        isItemsAreaOpen: false,
    }

    toggleItemsArea = () => {
        this.setState({ isItemsAreaOpen: !this.state.isItemsAreaOpen })
    }

    download = (event) => {
        const { canvas } = this.props

        this.handleGoogleAnalytics()

        this.updateMemeRating()

        canvas.deactivateAll().renderAll()
        const clickedElement = event.target.tagName === 'SPAN' ? event.target.parentNode : event.target

        //saveing the canvas and resizing it before downloading depends on screen resolution.
        const zoom = helpers.isMobile() ? 2.5 : 1.3

        canvas.setZoom(zoom)
        // need to enlarge canvas otherwise the svg will be clipped
        canvas.setWidth(canvas.getWidth() * zoom).setHeight(canvas.getHeight() * zoom)


        if (WebViewService.isWebView) {
            this.sendBase64ToNative(canvas.toDataURL())
            //!* need to set back canvas dimensions *
            canvas.setWidth(canvas.getWidth() / zoom).setHeight(canvas.getHeight() / zoom)
            canvas.setZoom(1);
            this.handleGoogleAnalytics(true)
            return
        }


        clickedElement.href = canvas.toDataURL()
        clickedElement.download = 'MemeKing'


        this.props.saveUserMemeToStorage({ urlPath: canvas.toDataURL(), date: new Date() })

        //!* need to set back canvas dimensions *
        canvas.setWidth(canvas.getWidth() / zoom).setHeight(canvas.getHeight() / zoom)
        canvas.setZoom(1)

        this.saveMemeNameToLocalStorage()
    }

    sendBase64ToNative = (base64) => {
        window.postMessage(base64)

    }


    saveMemeNameToLocalStorage = () => {
        LocalStorageService.addDownloadedMemeToMyMemesList(this.props.meme || null)
    }

    handleGoogleAnalytics(isMobileApp) {

        if(isMobileApp) {
            AnalyticsService.sendEvent('Mobile App');
            return;
        }

        const textAreas = document.getElementsByTagName('TEXTAREA')
        const description = _.get(this.props, 'meme.description')
        let text = `${description} : ${textAreas[0].value} ${textAreas[1].value}`
        AnalyticsService.sendEvent('Meme Downloaded', `${this.props.format}, ${text}`)
        if (this.props.format === 'dank') {
            AnalyticsService.sendEvent('Dank', text)
        }
    }


    updateMemeRating = () => {
        if (!(this.props.type === 'upload')) {
            this.props.updateMemeRating(this.props.meme)
        }
    }

    clearCanvas = () => {
        this.props.canvas.clear()
    }

    addTextLine = () => {
        this.TextFieldsContainer.addTextInput()
    }

    crop = () => {

        const location = {
            pathname: '/cropper',
            state: {
                image: this.props.meme.urlPath
            }
        }
        this.props.history.push(location)
    }

    changeFormat = () => {
        const { history, format, location, type, meme, query } = this.props
        const wantedFormat = (format === globalConstants.format.normal) ? globalConstants.format.dank : globalConstants.format.normal
        const wantedPath = location.pathname.replace(format, wantedFormat)
        const from = _.get(location, 'state.from')

        if (from === 'search') {
            const location = {
                pathname: wantedPath,
                state: {
                    urlPath: meme.urlPath,
                    from: 'search'
                },
                query
            }
            history.push(location)
        } else if (type === 'upload' || from === 'upload') {
            const location = {
                pathname: wantedPath,
                state: {
                    urlPath: meme.urlPath,
                    from: 'upload'
                },
                query
            }
            history.push(location)
        } else {
            history.push(wantedPath)

        }
    }

    render() {

        const { format, canvas, isCanvasReady, style } = this.props
        const FORMAT_BUTTON_TEXT = format === globalConstants.format.normal ? ' דאנק מימ' : " רגיל"
        const ADD_TEXT_LINE = "טקסט"
        const ADD_AN_ITEM = "פריטים"
        const DOWNLOAD = "הורדה"

        const buttonsStyle = style ? { top: (parseInt(_.head(_.split(style.top, 'px'))) + 15) + 'px' } : {}

        const Buttons = ({ className }) => (
            <div className={classNames("buttons-container", className)} style={buttonsStyle}>
                <Button
                    label={ADD_TEXT_LINE}
                    icon="glyphicon glyphicon-plus"
                    onClick={this.addTextLine}
                />

                <GeneratorUploader canvas={canvas}/>

                <Button label={ADD_AN_ITEM} icon="glyphicon glyphicon-sunglasses"
                        onClick={this.toggleItemsArea}
                />

                <Button label={FORMAT_BUTTON_TEXT}
                        onClick={this.changeFormat}
                        icon="glyphicon glyphicon-retweet"
                />

                <Button label={DOWNLOAD}
                        icon="glyphicon glyphicon-download-alt"
                        className={DOWNLOAD}
                        onClick={this.download}
                />

            </div>
        )

        return (
            <div style={style} className="box-generator-dashboard col-sm-12 col-lg-5">

                {helpers.isMobile() && <Buttons />}

                {isCanvasReady && (
                    <TextFieldsContainer ref={ elem => this.TextFieldsContainer = elem}
                                         canvas={canvas}
                                         format={format}
                    />
                )}

                {!helpers.isMobile() && <Buttons />}

                <GeneratorSignature className="visible-mobile"/>

                <Modal onHide={() => this.setState({ isItemsAreaOpen: false })}
                       show={this.state.isItemsAreaOpen && canvas}>
                    <ItemsArea canvas={canvas} closeModal={() => this.setState({ isItemsAreaOpen: false })}/>
                </Modal>

            </div>
        )
    }
}

