// @flow strict @jsx createElement

import '../../../../../css/options/select-button.css'

import {createElement} from 'react'

import Option from './Option'

const getLeftPercentage = (optionChoices, optionValue) =>
  optionChoices.indexOf(optionValue) * (100 / optionChoices.length)

type Props = {|
  optionChoices: Array<boolean>,
  optionName: string,
  optionValue: boolean,
  updateSingleOption: (string, boolean) => void
|}
const SelectButton = (props: Props) => (
  <div styleName='main'>
    <div
      styleName='cover'
      style={{
        left: `${getLeftPercentage(props.optionChoices, props.optionValue)}%`
      }}
    />
    {props.optionChoices.map((optionChoice) => (
      <Option
        key={String(optionChoice)}
        optionChoice={optionChoice}
        optionName={props.optionName}
        optionValue={props.optionValue}
        updateSingleOption={props.updateSingleOption}
      />
    ))}
  </div>
)

SelectButton.defaultProps = {
  optionChoices: [true, false]
}

export default SelectButton
