import React from 'react'
import styled from 'styled-components'

import { FounderMemberIcon, VerifiedMemberIcon, LeadMemberIcon } from '@/common/components/icons'
import { Colors } from '@/common/constants'
import { isString } from '@/common/utils'
import { useShowMemberModal } from '@/memberships/hooks/useShowMemberModal'

import {
  DarkTooltipInnerItemProps,
  DefaultTooltip,
  DefaultTooltipProps,
  Tooltip,
  TooltipComponent,
} from '../../common/components/Tooltip'
import { Member } from '../types'

import { Avatar } from './Avatar'
import {
  MemberHandle,
  MemberHead,
  MemberIcons,
  MemberId,
  MemberInfoWrap,
  MemberPhoto,
  MemberPhotoContainer,
} from './components'
import { MemberRoles, MemberStatusTooltip } from './MemberRoles'
import { MemberInfoWrapProps, MemberSize } from './types'

export interface MemberInfoContainerProps {
  isLead?: boolean
  member: Member
  size?: MemberSize
  className?: string
  maxRoles?: number
  avatarSmall?: boolean
  skipModal?: boolean
}

export type MemberInfoProps = MemberInfoContainerProps & MemberInfoWrapProps & { hideGroup?: boolean }

export const MemberInfo = React.memo(
  ({
    member,
    isOnDark,
    showIdOrText,
    hideGroup,
    onlyTop,
    memberSize,
    size,
    className,
    maxRoles,
    isLead,
    skipModal,
    avatarSmall,
  }: MemberInfoProps) => {
    const roleSize = size === 's' ? 'm' : size
    const showMemberModal = useShowMemberModal(member.id)
    const showRoles = !onlyTop && !hideGroup && !showIdOrText
    const showId = !onlyTop && !!showIdOrText

    return (
      <MemberInfoWrap
        isOnDark={isOnDark}
        memberSize={memberSize}
        className={className}
        hideGroup={hideGroup}
        onClick={skipModal ? undefined : showMemberModal}
        skipModal={skipModal}
        onlyTop={onlyTop}
      >
        <MemberPhoto small={avatarSmall}>
          <MemberPhotoContainer>
            <Avatar avatarUri={member.avatar} />
            {isLead && (
              <Tooltip tooltipText="This member is a Lead">
                <AvatarStarTooltipContainer>
                  <LeadMemberIcon />
                </AvatarStarTooltipContainer>
              </Tooltip>
            )}
          </MemberPhotoContainer>
        </MemberPhoto>
        <MemberHead>
          <MemberHandle>{member.handle}</MemberHandle>
          {(member.isVerified || member.isFoundingMember) && (
            <MemberIcons>
              {member.isVerified && (
                <Tooltip tooltipText="This member is verified">
                  <MemberStatusTooltip isOnDark={isOnDark} className={isOnDark ? 'tooltipondark' : 'tooltiponlight'}>
                    <VerifiedMemberIcon />
                  </MemberStatusTooltip>
                </Tooltip>
              )}
              {member.isFoundingMember && (
                <Tooltip tooltipText="This member is founder">
                  <MemberStatusTooltip isOnDark={isOnDark} className={isOnDark ? 'tooltipondark' : 'tooltiponlight'}>
                    <FounderMemberIcon />
                  </MemberStatusTooltip>
                </Tooltip>
              )}
            </MemberIcons>
          )}
        </MemberHead>
        {showRoles && <MemberRoles roles={member.roles} size={roleSize} max={maxRoles} />}
        {showId && <MemberId>{isString(showIdOrText) ? showIdOrText : `Member ID: ${member.id}`}</MemberId>}
      </MemberInfoWrap>
    )
  }
)

export const MemberInfoList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  row-gap: 16px;
`

export const MemberInfoItem = styled.li`
  width: 100%;
`

export const AvatarStarTooltipContainer = styled(DefaultTooltip)<DefaultTooltipProps & DarkTooltipInnerItemProps>`
  color: ${Colors.White};
  border-color: ${Colors.Blue[500]};
  background-color: ${Colors.Blue[500]};

  ${TooltipComponent}:hover > &,
  ${TooltipComponent}:focus > & {
    color: ${Colors.White};
    border-color: ${Colors.Blue[400]};
    background-color: ${Colors.Blue[400]};
  }
`
