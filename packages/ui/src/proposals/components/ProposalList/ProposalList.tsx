import React from 'react'

import { ProposalOrderByInput } from '@/common/api/queries'
import { List } from '@/common/components/List'
import { SortHeader } from '@/common/components/List/SortHeader'
import { RowGapBlock } from '@/common/components/page/PageContent'
import { NotFoundText } from '@/common/components/typography/NotFoundText'
import { GetSortProps } from '@/common/hooks/useSort'
import { useMyMemberships } from '@/memberships/hooks/useMyMemberships'
import { ProposalColLayout, ProposalsListHeaders, ProposalListHeader } from '@/proposals/constants'
import { Proposal } from '@/proposals/types'

import { ProposalListItem } from './ProposalListItem'

export interface ProposalListProps {
  proposals: Proposal[]
  getSortProps?: GetSortProps<ProposalOrderByInput>
  isPast?: boolean
}

export const ProposalList = ({ proposals, getSortProps, isPast }: ProposalListProps) => {
  const { active } = useMyMemberships()
  const isCouncilMember = active?.isCouncilMember

  if (!proposals.length) {
    return <NotFoundText>No proposals matching search criteria</NotFoundText>
  }
  return (
    <RowGapBlock gap={4}>
      <ProposalsListHeaders $colLayout={ProposalColLayout}>
        {getSortProps ? <SortHeader {...getSortProps('title')}>Title</SortHeader> : <ProposalListHeader />}
        <ProposalListHeader>Stage</ProposalListHeader>
        <ProposalListHeader>Proposer</ProposalListHeader>
        {isPast && getSortProps ? <SortHeader {...getSortProps('createdAt')}>Ended</SortHeader> : null}
        {isCouncilMember && <ProposalListHeader>My vote</ProposalListHeader>}
      </ProposalsListHeaders>
      <List as="div">
        {proposals.map((proposal) => (
          <ProposalListItem
            key={proposal.id}
            proposal={proposal}
            isPast={isPast}
            memberId={active?.id}
            isCouncilMember={isCouncilMember}
          />
        ))}
      </List>
    </RowGapBlock>
  )
}
