import { GroupProps } from 'ymlr/src/components/group/group.props'

export type OnProps = {
  filter?: string | string[] | RegExp | RegExp[]
  token?: string
} & GroupProps
