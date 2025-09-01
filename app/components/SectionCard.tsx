import {useLingui} from '@lingui/react/macro'
import {CardProps, Card as RNECard, withTheme} from '@rneui/themed'
import {FC} from 'react'

export const SectionCard: FC<CardProps> = props => {
  const {t} = useLingui()

  return <RNECard {...props} />
}

export default withTheme<CardProps>(SectionCard, 'SectionCard')
