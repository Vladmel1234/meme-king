import _ from 'lodash';
import React, { Component } from 'react';

// components
import MemeTextField from 'components/MemeTextField/MemeTextField';

export default class TextFieldsContainer extends Component {

    state = {
        textInputs: []
    }

    componentDidMount() {
            this.resetTextInputs(this.props.canvas)
    }

    componentWillReceiveProps(nextProps) {

        const isFormatChanged= (this.props.format !== nextProps.format);

        if (isFormatChanged) {
            this.setState({
                textInputs : []
            }, () => {
                this.resetTextInputs(nextProps.canvas)
            })
        }

    }

    resetTextInputs = (canvas) => {
        const initialTextInputs = [
            <MemeTextField
                format={this.props.format}
                key={_.uniqueId()}
                id={_.uniqueId()}
                remove={this.removeTextInput}
                canvas={canvas}
                position="top" />,
            <MemeTextField
                format={this.props.format}
                key={_.uniqueId()}
                id={_.uniqueId()} r
                remove={this.removeTextInput}
                canvas={canvas}
                position="bottom" /> ,
        ];

        this.setState({
            textInputs : initialTextInputs
        })
    }

     addTextInput = () => {
        this.setState({
            textInputs: [
                ...this.state.textInputs,
                <MemeTextField
                    key={_.uniqueId()}
                    format={this.props.format}
                    id={_.uniqueId()}
                    remove={this.removeTextInput}
                    canvas={this.props.canvas}
                    position="middle"
                />
            ]
        })
    }

    removeTextInput = (id) => {
        this.setState({
            textInputs: _.filter([...this.state.textInputs], textInput => textInput.props.id !== id)
        })
    }

    render() {
       return  (
           <div className="text-fields-container">
               {this.state.textInputs}
           </div>
       )
    }

}