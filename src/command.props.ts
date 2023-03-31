import { GroupProps } from 'ymlr/src/components/group/group.props'

export type CommandProps = {
  name?: string | string[]
  token?: string
} & GroupProps
