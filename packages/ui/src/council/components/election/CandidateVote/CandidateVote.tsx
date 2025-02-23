import BN from 'bn.js'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { ButtonPrimary, ButtonsGroup } from '@/common/components/buttons'
import { Arrow } from '@/common/components/icons'
import { ListItem } from '@/common/components/List'
import { RowGapBlock } from '@/common/components/page/PageContent'
import { ProgressBar } from '@/common/components/Progress'
import { TextInlineBig, TextInlineSmall, TokenValue } from '@/common/components/typography'
import { Subscription } from '@/common/components/typography/Subscription'
import { BN_ZERO, Colors } from '@/common/constants'
import { useModal } from '@/common/hooks/useModal'
import { MyCastVote } from '@/council/hooks/useElectionVotes'
import { CandidacyPreviewModalCall } from '@/council/modals/CandidacyPreview/types'
import { MemberInfo } from '@/memberships/components'
import { Member } from '@/memberships/types'

import { CandidateCardArrow, StatsValue } from '../CandidateCard/CandidateCard'

import { RevealVoteButton } from './RevealVoteButton'

export interface CandidateVoteProps {
  candidateId: string
  member: Member
  sumOfAllStakes: BN
  totalStake: BN
  ownStake?: BN
  votes: number
  index: number
  myVotes: MyCastVote[]
}

export const CandidateVote = ({
  candidateId,
  member,
  sumOfAllStakes,
  totalStake,
  ownStake,
  votes,
  index,
  myVotes,
}: CandidateVoteProps) => {
  const { showModal } = useModal()
  const showCandidate = useCallback(() => {
    showModal<CandidacyPreviewModalCall>({
      modal: 'CandidacyPreview',
      data: { id: candidateId },
    })
  }, [showModal])

  const roundedPercentage = totalStake.gt(BN_ZERO) ? sumOfAllStakes.muln(100).divRound(totalStake).toNumber() : 0
  const hasOwnStake = ownStake && ownStake.gt(BN_ZERO)
  const hasMyVotes = myVotes.length > 0
  const allVotesRevealed = myVotes.every((vote) => vote.voteFor)
  return (
    <CandidateVoteWrapper onClick={showCandidate}>
      <VoteIndex lighter inter>
        {index}
      </VoteIndex>
      <MemberInfo onlyTop member={member} skipModal={!member} />
      <VoteIndicatorWrapper gap={16}>
        <StakeIndicator>
          <ProgressBar start={0} end={roundedPercentage / 100} size="big" />
          <PercentageValue value bold>
            {roundedPercentage}%
          </PercentageValue>
        </StakeIndicator>
        <StakeAndVotesGroup>
          <StakeAndVotesRow>
            <Subscription>Total Stake</Subscription>
            <StatsValue>
              <TokenValue value={sumOfAllStakes} />
            </StatsValue>
          </StakeAndVotesRow>
          <StakeAndVotesRow>
            {hasOwnStake && (
              <>
                <Subscription>My Stake</Subscription>
                <StatsValue>
                  <TokenValue value={ownStake} />
                </StatsValue>
              </>
            )}
          </StakeAndVotesRow>
          <StakeAndVotesRow>
            <Subscription>Revealed votes</Subscription>
            <StatsValue>
              <TextInlineBig value>{votes}</TextInlineBig>
            </StatsValue>
          </StakeAndVotesRow>
        </StakeAndVotesGroup>
      </VoteIndicatorWrapper>
      <ButtonsGroup>
        {hasMyVotes &&
          (allVotesRevealed ? (
            <ButtonPrimary size="medium" disabled>
              Revealed
            </ButtonPrimary>
          ) : (
            <RevealVoteButton myVotes={myVotes} voteForHandle={member.handle} />
          ))}
      </ButtonsGroup>
      <CandidateCardArrow>
        <Arrow direction="right" />
      </CandidateCardArrow>
    </CandidateVoteWrapper>
  )
}

const VoteIndex = styled(TextInlineSmall)`
  text-align: center;
`

const PercentageValue = styled(TextInlineSmall)`
  position: absolute;
  left: calc(100% + 12px);
`

const StakeIndicator = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
`

const StakeAndVotesRow = styled.div`
  display: flex;
  align-items: center;
  column-gap: 6px;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
`

const StakeAndVotesGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: space-between;
  align-items: center;
  column-gap: 8px;
  width: 100%;
`

const VoteIndicatorWrapper = styled(RowGapBlock)`
  margin-top: 8px;
  padding-right: 46px;
`

const CandidateVoteWrapper = styled(ListItem)`
  position: relative;
  grid-template-columns: 32px 224px 1fr 120px;
  align-items: center;
  grid-column-gap: 8px;
  height: 116px;
  padding: 16px 48px 16px 8px;
  cursor: pointer;

  &:hover,
  &:focus,
  &:focus-within {
    border-color: ${Colors.Blue[100]};
    z-index: 1;

    ${CandidateCardArrow} {
      color: ${Colors.Blue[500]};
    }
  }

  ${ButtonsGroup} {
    margin-left: auto;
  }
`
