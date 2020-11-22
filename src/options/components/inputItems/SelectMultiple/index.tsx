import PlainList from '../../../../core/components/baseItems/PlainList'
import Option from './Option'
import classes from './styles.css'

interface Props {
  choices: Array<string | undefined>
  optionName: string
  optionValue: Array<number | undefined>
  updatePartialOptions: (options: {
    [key: string]: Array<number | undefined>
  }) => void
}
const SelectMultiple = (props: Props) => (
  <PlainList className={classes.main}>
    {props.choices.reduce<Array<React.ReactNode>>(
      (acc, optionChoice, optionChoiceIndex) => {
        if (optionChoice !== undefined) {
          return [
            ...acc,
            <li key={String(optionChoiceIndex)}>
              <Option
                optionChoice={optionChoice}
                optionChoiceIndex={optionChoiceIndex}
                optionName={props.optionName}
                optionValue={props.optionValue}
                updatePartialOptions={props.updatePartialOptions}
              />
            </li>,
          ]
        }

        return acc
      },
      [],
    )}
  </PlainList>
)

export default SelectMultiple
