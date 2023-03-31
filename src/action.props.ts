import { GroupProps } from 'ymlr/src/components/group/group.props'

export type ActionProps = {
  name?: string | string[] | RegExp | RegExp[]
  token?: string
} & GroupProps
