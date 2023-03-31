import { GroupProps } from 'ymlr/src/components/group/group.props'

export type HearsProps = {
  text?: string | string[] | RegExp | RegExp[]
  token?: string
} & GroupProps
